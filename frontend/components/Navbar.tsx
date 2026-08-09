"use client";

import Link from "next/link";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const cartItems = useCartStore((state) => state.cartItems);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: "none",
          color: "black",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        My E-Commerce Store
      </Link>

      <Link
        href="/cart"
        style={{
          textDecoration: "none",
          color: "black",
          fontSize: "18px",
        }}
      >
        🛒 Cart ({cartCount})
      </Link>
    </nav>
  );
}