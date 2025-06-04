import css from "./Subscribe.module.css";
import { useId, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must not exceed 50 characters")
    .required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

interface SubscribeFormProps {
  onSubmit: (data: { username: string; email: string }) => void;
}

export default function Subscribe({ onSubmit }: SubscribeFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});
  const fieldId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    // Очищення помилки для поля username при зміні
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
      // Валідація даних Yup
      await validationSchema.validate(data, { abortEarly: false });
      setErrors({}); // Очищення помилок, якщо валідація успішна
      onSubmit(data); // Виклик функції onSubmit з валідними даними
    } catch (validationError) {
      // Обробка помилок валідації
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
      <label htmlFor={`${fieldId}-username`}>Name</label>
      <input
        type="text"
        name="username"
        id={`${fieldId}-username`}
        value={inputValue}
        onChange={handleChange}
        aria-invalid={!!errors.username}
        aria-describedby={errors.username ? `${fieldId}-username-error` : undefined}
      />
      {errors.username && (
        <div id={`${fieldId}-username-error`} className={css.error}>
          {errors.username}
        </div>
      )}
      <label htmlFor={`${fieldId}-email`}>E-mail</label>
      <input
        type="text"
        name="email"
        defaultValue="someone@ukr.net"
        id={`${fieldId}-email`}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? `${fieldId}-email-error` : undefined}
      />
      {errors.email && (
        <div id={`${fieldId}-email-error`} className={css.error}>
          {errors.email}
        </div>
      )}
      <button className={css.button} type="submit">
        Submit
      </button>
    </form>
  );
}
