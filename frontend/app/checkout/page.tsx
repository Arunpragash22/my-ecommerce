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
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-4 text-slate-500">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Checkout</h1>
      <p className="mb-8 text-slate-500">
        Fill in your details to place the order
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order summary */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Order Summary
          </h2>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-slate-900">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-lg font-medium text-slate-600">Total</span>
            <span className="text-2xl font-bold text-indigo-600">₹{total}</span>
          </div>
        </section>

        {/* Customer form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Customer Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Example: 94774162294"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Enter your WhatsApp number with country code.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                required
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
