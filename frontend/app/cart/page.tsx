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
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Shopping Cart</h1>
      <p className="mb-8 text-slate-500">
        Review your items before checkout
      </p>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-lg text-slate-500">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    LKR {item.price} each
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-slate-200">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-3 py-2 text-lg font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-3 py-2 text-lg font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>

                  <p className="min-w-[5rem] text-right font-bold text-slate-900">
                    LKR {item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-slate-600">Total</span>
              <span className="text-3xl font-bold text-indigo-600">
                LKR {total}
              </span>
            </div>

            <Link href="/checkout" className="mt-6 block">
              <button className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
