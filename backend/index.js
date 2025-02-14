import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import pkg from "pg";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const guestSchema = z.object({
  name: z.string().min(1, { message: "Du har inte fyllt i namn" }),
  lastName: z.string().min(1, { message: "Du har inte fyllt i efternamn" }),
  email: z
    .string()
    .email({ message: "Fyll i en giltig e-mail" })
    .min(1, { message: "Fyll i en giltig e-mail" }),
  attendingWedding: z
    .enum(["true", "false"], {
      message: "Du måste välja något.. ",
    })
    .default("true"),
  attendingDinner: z
    .enum(["true", "false"], {
      message: "Du måste välja något.. ",
    })
    .default("true"),
  specialFood: z.string().optional(),
  misc: z.string().optional(),
});

const formSchema = z.object({
  guests: z.array(guestSchema),
});

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

const app = express();

app.use(express.json());

app.use(cors());

const saveRsvp = async (client, guests) => {
  try {
    // Start a transaction
    await client.query("BEGIN");

    // Step 1: Insert into Parties table and retrieve the party ID
    const partyResult = await client.query(
      "INSERT INTO Parties DEFAULT VALUES RETURNING id",
    );
    const partyId = partyResult.rows[0].id;

    // Step 2: Insert each guest into Guests table
    const guestInsertPromises = guests.map((guest) => {
      return client.query(
        `
        INSERT INTO Guests (
          party_id, name, last_name, email, attending_wedding, attending_dinner, special_food, misc
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          partyId,
          guest.name,
          guest.lastName,
          guest.email,
          guest.attendingWedding,
          guest.attendingDinner,
          guest.specialFood,
          guest.misc,
        ],
      );
    });

    // Wait for all guest insertions to complete
    await Promise.all(guestInsertPromises);

    // Commit the transaction
    await client.query("COMMIT");

    return { success: true };
  } catch (error) {
    // Rollback transaction on error
    await client.query("ROLLBACK");
    console.error("Error saving RSVP:", error);
    throw error;
  }
};

app.post("/api/submit", async (req, res) => {
  // Validate the request body using safeParse
  const result = formSchema.safeParse(req.body);

  if (!result.success) {
    // Handle validation errors
    return res.status(400).json({ errors: result.errors.error });
  }

  // Destructure the validated data
  const { guests } = result.data;

  // Send a confirmation email
  try {
    // const emailResult = await sendEmails(guests);
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    // Looping through all emails that were registered

    const emailPromises = guests.map((guest) => {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: guest.email,
        subject: "Bekräftelsemail",
        html: `
      <h1>Hej!</h1>
      <p>Tack för ditt svar. Vi bekräftar härmed ditt svar: </p>
      <p> Namn: ${guest.name}</p>
      <p> Efternamn: ${guest.lastName}</p>
      <p> E-post: ${guest.email}</p>
      <p> Kommer på bröllopet: ${
        guest.attendingWedding === "true" ? "Ja" : "Nej"
      }</p>
      <p> Kommer på uppladdning fredag: ${
        guest.attendingDinner === "true" ? "Ja" : "Nej"
      }</p>
      <p> Specialmat: ${
        guest.specialFood ? guest.specialFood : "Inget anmält"
      }</p>
      <p> Övrigt: ${guest.misc}</p>
      `,
      };
      transporter.sendMail(mailOptions);
    });

    // Prosime.all to wait for all emails to be sent
    await Promise.all(emailPromises);
  } catch {
    res.status(500).json({ message: "Failed to send email" });
  }

  // Insert the data into the database
  try {
    await saveRsvp(client, guests);

    res.status(200).json({ message: "Data saved successfully" });
  } catch {
    return res.status(500).json({ message: "Failed to save data" });
  }
});

app.post("/api/song", async (req, res) => {
  const { data } = req.body;
  try {
    client.query(`INSERT INTO Songs (song) VALUES ($1)`, [data.song]);
  } catch (error) {
    console.log(error);
  } finally {
    res.status(200).json({ message: "Data saved successfully" });
  }
});

// Middleware to authenticate admin using JWT
function authenticateAdmin(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    req.user = decoded;
    next();
  });
}

// Route to generate JWT
app.post("/api/login", async (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/api/rsvp", authenticateAdmin, async (req, res) => {
  try {
    const result = await client.query(
      `
          SELECT
        party_id AS "party",
        CONCAT(name, ' ', last_name) AS "namn",
        email,
        CASE
            WHEN attending_wedding THEN 'Ja'
            ELSE 'Nej'
        END AS "attendingWedding",
        CASE
            WHEN attending_dinner THEN 'Ja'
            ELSE 'Nej'
        END AS "attendingDinner",
        COALESCE(special_food, 'Ingen') AS "specialFood",
        COALESCE(misc, 'Ingen') AS "other"
    FROM
        Guests;
        `,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(path.join(path.resolve(), "dist")));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`);
});
