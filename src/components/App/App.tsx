import css from "./App.module.css";
import Header from "../Header/Header";
import Hero from "../Hero/Hero";
import Benefits from "../Benefits/Benefits";
import type { Benefit } from "../../types/types";
import { useState } from "react";

export default function App() {
  const benefits: Benefit[] = [
    { name: "Швидка доставка", color: "#F00" },
    { name: "Гнучкі знижки", color: "#0F0" },
    { name: "Цілодобова підтримка", color: "#00F" },
    { name: "Ексклюзивні пропозиції", color: "#0FF" },
    { name: "Гарантія якості", color: "#FF0" },
  ];

  const [clicks, setClicks] = useState(0);

  return (
    <div className={css.container}>
      <Header clicks={clicks} />
      <Hero setClicks={setClicks} clicks={clicks} />
      {benefits.length && (
        <ul>
          {benefits.map((benefit, index) => (
            <Benefits key={index} name={benefit.name} color={benefit.color} />
          ))}
        </ul>
      )}
    </div>
  );
}
