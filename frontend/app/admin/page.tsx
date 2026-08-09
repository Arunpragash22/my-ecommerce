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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px",
      }}
    >
      <h1>Admin Portal</h1>

      <button
        onClick={() => {
            localStorage.removeItem("adminUser");
            router.push("/admin/login");
        }}
        style={{
            padding: "10px 20px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
        }}
        >
        Logout
    </button>

      <p>Welcome to Admin Dashboard</p>

      <hr style={{ margin: "30px 0" }} />

      {/* Dashboard */}
      <h2>Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
          }}
        >
          <h3>Total Products</h3>

          <p
            style={{
              fontSize: "35px",
              fontWeight: "bold",
            }}
          >
            {productCount}
          </p>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
          }}
        >
          <h3>Total Orders</h3>

          <p
            style={{
              fontSize: "35px",
              fontWeight: "bold",
            }}
          >
            {orderCount}
          </p>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
          }}
        >
          <h3>Total Sales</h3>

          <p
            style={{
              fontSize: "35px",
              fontWeight: "bold",
            }}
          >
            ₹0
          </p>
        </div>
      </div>

      {/* Add Product */}
      <section
        style={{
          background: "white",
          marginTop: "40px",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "700px",
        }}
      >
        <h2>➕ Add New Product</h2>

        <form onSubmit={handleAddProduct}>
          <div style={{ marginBottom: "20px" }}>
            <label>Product Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter product name"
              required
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                marginTop: "6px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter product description"
              required
              rows={4}
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                marginTop: "6px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Price</label>

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="Enter price"
              required
              min="0"
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                marginTop: "6px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Stock</label>

            <input
              type="number"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              placeholder="Enter stock"
              required
              min="0"
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                marginTop: "6px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Category</label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="Example: Shoes"
              required
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Image */}
          <div style={{ marginBottom: "20px" }}>
            <label>Product Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{
                display: "block",
                marginTop: "10px",
              }}
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ marginBottom: "20px" }}>
              <p>Image Preview:</p>

              <img
                src={imagePreview}
                alt="Product preview"
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px 25px",
              background: loading
                ? "#999"
                : "black",
              color: "white",
              border: "none",
              borderRadius: "7px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading
              ? "Adding Product..."
              : "Add Product"}
          </button>
        </form>
      </section>
      <hr style={{ margin: "50px 0" }} />

        <section
        style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
        }}
        >
        <h2>📦 Product List</h2>

        {products.length === 0 ? (
            <p>No products found.</p>
        ) : (
            products.map((product) => (
            <div
                key={product.id}
                style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                }}
            >
                <img
                src={
                    product.imageUrl?.startsWith("http")
                    ? product.imageUrl
                    : `https://my-ecommerce-okowta.fly.dev${product.imageUrl}`
                }
                alt={product.name}
                style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                }}
                />

                <div style={{ flex: 1 }}>
                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <p>
                    <strong>Price:</strong> ₹{product.price}
                </p>

                <p>
                    <strong>Stock:</strong> {product.stock}
                </p>

                <p>
                    <strong>Category:</strong> {product.category}
                </p>
                </div>

                <button
                onClick={() =>
                    handleDeleteProduct(product.id)
                }
                style={{
                    padding: "10px 18px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
                >
                🗑️ Delete
                </button>
            </div>
            ))
        )}
        </section>
        <hr style={{ margin: "50px 0" }} />

        <section
        style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
        }}
        >
        <h2>📦 Orders</h2>

        {orders.length === 0 ? (
            <p>No orders found.</p>
        ) : (
            orders.map((order) => (
            <div
                key={order.id}
                style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                }}
            >
                <h3>Order #{order.id}</h3>

                <p>
                <strong>Customer:</strong>{" "}
                {order.customerName}
                </p>

                <p>
                <strong>Phone:</strong>{" "}
                {order.phoneNumber}
                </p>

                <p>
                <strong>Address:</strong>{" "}
                {order.address}
                </p>

                <p>
                <strong>Total:</strong>{" "}
                ₹{order.totalAmount}
                </p>

                <p>
                <strong>Date:</strong>{" "}
                {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-"}
                </p>

                {order.items &&
                order.items.length > 0 && (
                    <>
                    <h4>Products</h4>

                    {order.items.map((item: any) => (
                        <p key={item.id}>
                        {item.product?.name} × {item.quantity}
                        {" — ₹"}
                        {item.price * item.quantity}
                        </p>
                    ))}
                    </>
                )}
            </div>
            ))
        )}
        </section>
    </main>
  );
}