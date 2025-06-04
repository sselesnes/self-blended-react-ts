import css from "./Subscribe.module.css";
import { useId, useState } from "react";

interface SubscribeFormProps {
  onSubmit: (data: { username: string; email: string }) => void;
}

export default function Subscribe({ onSubmit }: SubscribeFormProps) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    setInputValue(event.target.value);
  };

  const fieldId = useId();
  const handleSubmit = (formData: FormData) => {
    //  Тип FormData – вбудований, тому нічого додатково імпортувати не треба.
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    // formData.get() повертає значення типу FormDataEntryValue | null
    if (typeof username === "string" && typeof email === "string") {
      onSubmit({ username, email });
    }
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <label htmlFor={`${fieldId}-name`}>Name</label>
      <input
        type="text"
        name="username"
        // Subscribe contains an input of type text with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props.
        // defaultValue="John Doe"
        id={`${fieldId}-username`}
        value={inputValue}
        onChange={handleChange}
      />
      <label htmlFor={`${fieldId}-email`}>E-mail</label>
      <input type="email" name="email" defaultValue="someone@ukr.net" id={`${fieldId}-email`} />
      <button className={css.button} type="submit">
        Submit
      </button>
    </form>
  );
}
