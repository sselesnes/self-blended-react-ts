import css from "./App.module.css";
import Header from "../Header/Header";
import Hero from "../Hero/Hero";
import Benefits from "../Benefits/Benefits";
import type { Benefit } from "../../types/types";
import { useState } from "react";
import Subscribe from "../Subscribe/Subscribe";
import Modal from "../Modal/Modal";
import Crud from "../Crud/CRUD";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Повторювати запит 2 рази у разі помилки
      staleTime: 5 * 60 * 1000, // Дані свіжі 5 хвилин
    },
  },
});

export default function App() {
  const benefits: Benefit[] = [
    { name: "Fast delivery", color: "#F00" },
    { name: "Flexible discounts", color: "#0F0" },
    { name: "24/7 support", color: "#00F" },
    { name: "Exclusive offers", color: "#0FF" },
    { name: "Quality guarantee", color: "#FF0" },
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
      {/* QueryClientProvider має обгортати компонент на вищому рівні ієрархії додатка, а не всередині самого компонента */}
      <QueryClientProvider client={queryClient}>
        <Crud />
      </QueryClientProvider>
      {/* <Hero setClicks={setClicks} clicks={clicks} /> */}
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
