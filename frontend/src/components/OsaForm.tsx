import { SubmitHandler, useFormContext } from "react-hook-form";
import { GuestType } from "../types/types";
import IsNotComingForm from "./IsNotComingForm";
import { StartFieldSet } from "./StartFieldset";
import { useState } from "react";

export default function OsaForm() {
  const { register, handleSubmit } = useFormContext<GuestType>();
  const [isComing, setIsComing] = useState<boolean>(false);

  const onSubmit: SubmitHandler<GuestType> = (data) => {
    fetch("/api/submit", { method: "POST", body: JSON.stringify(data) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-container">
        <StartFieldSet setIsComing={setIsComing} />

        {isComing && (
          <>
            <fieldset className="radio-buttons-container">
              <label>
                Jag kommer gärna kvällen innan fredagen 27/6
                <input
                  {...register("attendingDinner")}
                  type="radio"
                  name="osa-friday"
                  value="Självklart"
                />{" "}
                Självklart!
                <input
                  {...register("attendingWedding")}
                  type="radio"
                  name="osa-friday"
                  value="Tyvärr"
                />{" "}
                Tyvärr inte..
              </label>
            </fieldset>

            <label className="input-field">
              Förnamn
              <input {...register("firstName")} type="text" />
            </label>
            <label className="input-field">
              Efternamn
              <input {...register("lastName")} type="text" />
            </label>
            <label className="input-field">
              Mailadress
              <input type="email" {...register("email")} />
            </label>
            <label className="input-field">
              Specialkost
              <input
                {...register("specialFood")}
                type="text"
                name="Specialkost"
              />
            </label>
            <label className="input-field">
              Övrigt
              <p>Är det något annat brudparet bör känna till? </p>
              <input {...register("misc")} type="text" name="Övrigt" />
            </label>
          </>
        )}
      </div>

      <div className="osa-form">{!isComing && <IsNotComingForm />}</div>

      <button type="submit">Spara</button>
    </form>
  );
}
