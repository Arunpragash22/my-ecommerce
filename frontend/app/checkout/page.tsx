"use client";

import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import api from "../../services/api";

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const orderData = {
        customerName: name,
        phoneNumber: phone,
        address: address,
        totalAmount: total,

        items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        })),
        };

      // 1. Create order
      const response = await api.post("/orders", orderData);

      console.log("Order created:", response.data);

      // 2. Create WhatsApp message
      const message = `
🛍️ Order Confirmed!

Order ID: #${response.data.id}

Customer: ${name}
Phone: ${phone}

Products:
${cartItems
  .map(
    (item) =>
      `${item.name} × ${item.quantity} - ₹${
        item.price * item.quantity
      }`
  )
  .join("\n")}

Total: ₹${total}

Delivery Address:
${address}

Thank you for your order! ❤️
`;

      // 3. Clean phone number
      const whatsappNumber = phone.replace(/\D/g, "");

      // 4. WhatsApp URL
      const whatsappUrl =
        `https://wa.me/${whatsappNumber}` +
        `?text=${encodeURIComponent(message)}`;

      // 5. Clear cart
      clearCart();

      // 6. Open customer's WhatsApp
      window.location.href = whatsappUrl;

    } catch (error) {
      console.error("Order creation failed:", error);

      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "700px",
      }}
    >
      <h1>Checkout</h1>

      <h2>Order Summary</h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <strong>{item.name}</strong>

          <p>
            Quantity: {item.quantity}
          </p>

          <p>
            ₹{item.price * item.quantity}
          </p>
        </div>
      ))}

      <h2>Total: ₹{total}</h2>

      <hr style={{ margin: "30px 0" }} />

      <h2>Customer Details</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Phone Number</label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Example: 94774162294"
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "5px",
            }}
          />

          <small>
            Enter your WhatsApp number with country code.
          </small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Address</label>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            required
            rows={5}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "5px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 25px",
            background: loading ? "#999" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </main>
  );
}