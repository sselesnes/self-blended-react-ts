import css from "./Header.module.css";
import reactLogo from "../../assets/react.svg";

export default function Header() {
  return (
    <div className={css.container}>
      <img src={reactLogo} alt="React logo" width="64" />
      <p className={css.text}>Hello App</p>
      <p>{timeString}</p>
    </div>
  );
}

const timestamp = Date.now();
const date = new Date(timestamp);
const timeString = date.toLocaleTimeString("uk-UA", {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
