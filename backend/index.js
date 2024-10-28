const dotenv = require("dotenv"),
  express = require("express"),
  { Client } = require("pg");

const app = express();

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

app.get("/", async (request, response) => {
  const { rows } = await client.query("SELECT * FROM guests");

  response.send(rows);
});

// app.post("/post", async (request, response) => {
//   const res = await client.query(
//     "INSERT INTO guests (first_name, last_name, email) VALUES ($1, $2, $3)",
//     ["Jimmie", "Rissanen", "jimmies@me.com"]
//   );
// });

// app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(3000, () => {
  console.log("Redo på http://localhost:3000/");
});
