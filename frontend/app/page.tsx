"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "../services/api";
import { useCartStore, Product } from "../store/cartStore";

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);

  const cartItems = useCartStore((state) => state.cartItems);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    api
      .get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main style={{ padding: "40px" }}>
      <h1>🛍️ My E-Commerce Store</h1>

      <p>Welcome to our online store</p>

      <h2>Products</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <img
              src={
                product.imageUrl.startsWith("http")
                  ? product.imageUrl
                  : `http://localhost:8080${product.imageUrl}`
              }
              alt={product.name}
              style={{
                width: "100%",
                height: "320px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h2>{product.name}</h2>

            <p>{product.description}</p>

            <p>
              <strong>₹{product.price}</strong>
            </p>

            <p>Category: {product.category}</p>

            <p>Stock: {product.stock}</p>

            {/* IMPORTANT: product is available here */}
            <button
              onClick={() => {
                addToCart(product);
                router.push("/cart");
              }}
              style={{
                padding: "10px 20px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2>Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <p>
                {item.name} × {item.quantity} — ₹
                {item.price * item.quantity}
              </p>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>
        </>
      )}
    </main>
  );
}