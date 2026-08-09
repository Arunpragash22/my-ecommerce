"use client";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );
  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );
  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main style={{ padding: "40px" }}>
      <h1>Shopping Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
              }}
            >
              <h2>{item.name}</h2>

              <p>Price: ₹{item.price}</p>

              <p>
                Quantity: {item.quantity}
              </p>

              <button
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </button>

              <button
                onClick={() => increaseQuantity(item.id)}
                style={{ marginLeft: "10px" }}
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  marginLeft: "20px",
                  background: "red",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Remove
              </button>

              <p>
                Subtotal: ₹{item.price * item.quantity}
              </p>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>

          <Link href="/checkout">
            <button
                style={{
                padding: "12px 25px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                }}
            >
                Proceed to Checkout
            </button>
         </Link>
        </>
      )}
    </main>
  );
}