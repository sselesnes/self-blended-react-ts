import css from "./Hero.module.css";
import type { Dispatch, SetStateAction } from "react";

interface HeroProps {
  clicks: number;
  setClicks: Dispatch<SetStateAction<number>>;
}

export default function Hero({ clicks, setClicks }: HeroProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setClicks(clicks + 1);
    localStorage.setItem("saved-clicks", JSON.stringify(clicks + 1));

    // Виклик setClicks(clicks + 1) оновлює стан у App.tsx, що призводить до повторного рендерингу компонентів Header і Hero, які отримують оновлене значення clicks. Рендер відбувається коли оновлюється стан (useState) або змінюються пропси. Стан у React завжди локальний для кожної копії компонента. Якщо ми рендеримо один і той самий компонент кілька разів – кожен екземпляр зберігає свій окремий стан. При зміні стану рендер відбувається через diffing.

    console.log("here btn", clicks, event.target);
  };

  return (
    <div className={css.container}>
      <p>
        Hero is <button onClick={handleClick}>HERE</button>
      </p>
    </div>
  );
}
