"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function AdminPage() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const loadCounts = () => {
    api
      .get("/products/count")
      .then((response) => {
        setProductCount(response.data);
      })
      .catch((error) => {
        console.error("Product count error:", error);
      });

    api
      .get("/orders/count")
      .then((response) => {
        setOrderCount(response.data);
      })
      .catch((error) => {
        console.error("Order count error:", error);
      });
      api
    .get("/products")
    .then((response) => {
        setProducts(response.data);
    })
    .catch((error) => {
        console.error("Products error:", error);
    });

    api
        .get("/orders")
        .then((response) => {
            setOrders(response.data);
        })
        .catch((error) => {
            console.error("Orders error:", error);
    });
  };

 useEffect(() => {
  const adminUser = localStorage.getItem("adminUser");

  if (!adminUser) {
    router.replace("/admin/login");
    return;
  }

  const user = JSON.parse(adminUser);

  if (user.role !== "ADMIN") {
    localStorage.removeItem("adminUser");
    router.replace("/admin/login");
    return;
  }

  loadCounts();
}, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleDeleteProduct = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await api.delete(`/products/${id}`);

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== id
      )
    );

    setProductCount((count) => count - 1);

    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Delete product error:", error);

    alert("Failed to delete product.");
  }
};

  const handleAddProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a product image.");
      return;
    }

    try {
      setLoading(true);

      // 1. Upload image
      const formData = new FormData();
      formData.append("file", image);

      const uploadResponse = await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = uploadResponse.data;

      // 2. Create product
      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        imageUrl,
      };

      await api.post("/products", productData);

      alert("Product added successfully!");

      // Clear form
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImage(null);
      setImagePreview("");

      // Refresh product count
      loadCounts();
    } catch (error) {
      console.error("Product creation failed:", error);

      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Admin header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-sm text-slate-500">Manage your store</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("adminUser");
              router.push("/admin/login");
            }}
            className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard stats */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Products</p>
            <p className="mt-2 text-4xl font-bold text-indigo-600">
              {productCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Orders</p>
            <p className="mt-2 text-4xl font-bold text-emerald-600">
              {orderCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Sales</p>
            <p className="mt-2 text-4xl font-bold text-violet-600">LKR 0</p>
          </div>
        </div>

        {/* Add product form */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Add New Product
          </h2>

          <form onSubmit={handleAddProduct} className="max-w-2xl space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                required
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  required
                  min="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Enter stock"
                  required
                  min="0"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Example: Shoes"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {imagePreview && (
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Image Preview
                </p>
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-48 w-48 rounded-xl border border-slate-200 object-cover"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </section>

        {/* Product list */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Product List
          </h2>

          {products.length === 0 ? (
            <p className="text-slate-500">No products found.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={
                      product.imageUrl?.startsWith("http")
                        ? product.imageUrl
                        : `https://my-ecommerce-okowta.fly.dev${product.imageUrl}`
                    }
                    alt={product.name}
                    className="h-24 w-24 shrink-0 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500 line-clamp-1">
                      {product.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      <span className="font-semibold text-indigo-600">
                        LKR {product.price}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-600">
                        Stock: {product.stock}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-600">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="shrink-0 rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Orders */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Orders</h2>

          {orders.length === 0 ? (
            <p className="text-slate-500">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">
                      Order #{order.id}
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      LKR {order.totalAmount}
                    </span>
                  </div>

                  <div className="grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-slate-700">
                        Customer:
                      </span>{" "}
                      {order.customerName}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Phone:
                      </span>{" "}
                      {order.phoneNumber}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-medium text-slate-700">
                        Address:
                      </span>{" "}
                      {order.address}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">Date:</span>{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 border-t border-slate-200 pt-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Items
                      </p>
                      {order.items.map((item: any) => (
                        <p
                          key={item.id}
                          className="text-sm text-slate-600"
                        >
                          {item.product?.name} × {item.quantity}
                          {" — LKR "}
                          {item.price * item.quantity}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
