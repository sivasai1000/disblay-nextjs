"use client";

import { useState, useEffect } from "react";
import UserComboDetails from "./UserComboDetails";

export default function ClientComboDashboard() {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart")) || { type: null, items: [] };
    }
    return { type: null, items: [] };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <UserComboDetails cart={cart} setCart={setCart} />
  );
}
