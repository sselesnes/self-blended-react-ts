import css from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={css.container}>
      <p>
        Hero is <span>HERE</span>
      </p>
    </div>
  );
}
