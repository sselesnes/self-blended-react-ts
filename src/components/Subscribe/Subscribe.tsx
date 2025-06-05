import css from "./Subscribe.module.css";
import { useId, useState } from "react";
import * as Yup from "yup";

// Схема валідації
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must not exceed 50 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must be in format xxx@xxx.yyy (e.g., someone@ukr.net)"
    )
    .required("Email is required"),
});

interface SubscribeFormProps {
  onSubmit: (data: { username: string; email: string }) => void;
}

export default function Subscribe({ onSubmit }: SubscribeFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});
  const fieldId = useId();

  const usernameId = `${fieldId}-username`;
  const emailId = `${fieldId}-email`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (event.target.name === "username" && errors.username) {
      setErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
    };

    try {
      await validationSchema.validate(data, { abortEarly: false });
      setErrors({});
      onSubmit(data);
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        const errorMessages: { username?: string; email?: string } = {};
        validationError.inner.forEach(error => {
          if (error.path) {
            errorMessages[error.path as keyof typeof errorMessages] = error.message;
          }
        });
        setErrors(errorMessages);
      }
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div id={`${usernameId}-wrapper`}>
        <label htmlFor={usernameId}>Name</label>
        <input
          type="text"
          name="username"
          id={usernameId}
          value={inputValue}
          onChange={handleChange}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? `${usernameId}-error` : undefined}
        />
        {errors.username && (
          <div id={`${usernameId}-error`} className={css.error}>
            {errors.username}
          </div>
        )}
      </div>
      <div id={`${emailId}-wrapper`}>
        <label htmlFor={emailId}>E-mail</label>
        <input
          type="text"
          name="email"
          defaultValue="someone@ukr.net"
          id={emailId}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
        />
        {errors.email && (
          <div id={`${emailId}-error`} className={css.error}>
            {errors.email}
          </div>
        )}
      </div>
      <button className={css.button} type="submit">
        Submit
      </button>
    </form>
  );
}
