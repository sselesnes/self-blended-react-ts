import css from "./Header.module.css";
import reactLogo from "../../assets/react.svg";
import { useState, useEffect } from "react";

interface HeaderProps {
  clicks: number;
}

export default function Header({ clicks }: HeaderProps) {
  const [timeString, setTimeString] = useState(() => {
    const date = new Date();
    return date.toLocaleTimeString("uk-UA", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  });

  // інтервал за допомогою useEffect, щоб уникнути витоків пам’яті
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setTimeString(
        date.toLocaleTimeString("uk-UA", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(interval); // Очищення інтервалу
  }, []);

  return (
    <div className={css.container}>
      <img src={reactLogo} alt="React logo" width="64" />
      <p className={css.text}>Hello App</p>
      <p>Час: {timeString}</p>
      <p>Кількість кліків: {clicks}</p>
    </div>
  );
}
