"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const user = response.data;

      if (user.role !== "ADMIN") {
        alert("You are not authorized as an admin.");
        return;
      }

      // Temporary storage
      localStorage.setItem(
        "adminUser",
        JSON.stringify(user)
      );

      alert("Admin login successful!");

      router.push("/admin");
    } catch (error: any) {
      console.error("Admin login failed:", error);

      alert(
        error.response?.data ||
          "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "35px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "450px",
          border: "1px solid #ddd",
        }}
      >
        <h1>🔐 Admin Login</h1>

        <p>Login to Admin Portal</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Admin email"
              required
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                marginTop: "5px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Admin password"
              required
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
              width: "100%",
              padding: "13px",
              background: loading
                ? "#999"
                : "black",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>
        </form>
      </div>
    </main>
  );
}