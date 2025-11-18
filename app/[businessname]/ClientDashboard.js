"use client";

import { useState, useEffect } from "react";
import UserDashboard from "./UserDashboard";

export default function ClientDashboard({ ssrPackage, ssrBusiness, businessname }) {
  
  // ⭐ Cart state (client only)
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart")) || { type: null, items: [] };
    }
    return { type: null, items: [] };
  });

  const [business, setBusiness] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <UserDashboard
      cart={cart}
      setCart={setCart}
      setBusiness={setBusiness}
      ssrPackage={ssrPackage}
      ssrBusiness={ssrBusiness}
      businessname={businessname}
    />
  );
}
