"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "../services/api";
import { useCartStore, Product } from "../store/cartStore";

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => setLoading(false));
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-14 text-white shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to MyStore
        </h1>
        <p className="mt-3 max-w-xl text-lg text-indigo-100">
          Discover quality products at great prices. Shop now and get your order
          confirmed via WhatsApp.
        </p>
      </section>

      {/* Products */}
      <section>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Products</h2>
            <p className="mt-1 text-slate-500">
              {products.length} item{products.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-4 h-64 rounded-xl bg-slate-200" />
                <div className="mb-2 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mb-4 h-4 w-full rounded bg-slate-100" />
                <div className="h-10 rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-lg text-slate-500">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      product.imageUrl.startsWith("http")
                        ? product.imageUrl
                        : `https://my-ecommerce-okowta.fly.dev${product.imageUrl}`
                    }
                    alt={product.name}
                    className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {product.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">
                        LKR {product.price}
                      </p>
                      <p className="text-xs text-slate-400">
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product);
                        router.push("/cart");
                      }}
                      disabled={product.stock <= 0}
                      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Cart preview */}
      {cartItems.length > 0 && (
        <section className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Your Cart ({cartItems.length} item
            {cartItems.length !== 1 ? "s" : ""})
          </h2>
          <div className="divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3"
              >
                <span className="font-medium text-slate-700">
                  {item.name}{" "}
                  <span className="text-slate-400">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-slate-900">
                  LKR {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-lg font-bold text-slate-900">Total</span>
            <span className="text-2xl font-bold text-indigo-600">LKR {total}</span>
          </div>
        </section>
      )}
    </main>
  );
}
