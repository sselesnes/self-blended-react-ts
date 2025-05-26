import css from "./App.module.css";
import Header from "../Header/Header";
import Hero from "../Hero/Hero";
import Benefits from "../Benefits/Benefits";
import type { Benefit } from "../../types/types";
import { useState } from "react";
import Subscribe from "../Subscribe/Subscribe";
import Modal from "../Modal/Modal";

export default function App() {
  const benefits: Benefit[] = [
    { name: "Швидка доставка", color: "#F00" },
    { name: "Гнучкі знижки", color: "#0F0" },
    { name: "Цілодобова підтримка", color: "#00F" },
    { name: "Ексклюзивні пропозиції", color: "#0FF" },
    { name: "Гарантія якості", color: "#FF0" },
  ];

  const [clicks, setClicks] = useState(0);

  const handleSubscribe = (data: { username: string; email: string }) => {
    console.log("Submit received:", data);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.container}>
      <Header clicks={clicks} />
      <Hero setClicks={setClicks} clicks={clicks} />
      {benefits.length && (
        <ul className={css.benefits}>
          {benefits.map((benefit, index) => (
            <Benefits key={index} name={benefit.name} color={benefit.color} />
          ))}
        </ul>
      )}
      <Subscribe onSubmit={handleSubscribe} />
      <button onClick={openModal}>Open modal</button>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2>Custom Modal Content</h2>
          <p>This is a reusable modal with dynamic content.</p>
        </Modal>
      )}
    </div>
  );
}
