"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function LoginPage() {
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

      console.log("Login successful:", response.data);

      alert("Login successful!");

      // Temporary
      router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error);

      alert(
        error.response?.data ||
          "Invalid email or password."
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
        <h1>🔐 Login</h1>

        <p>Login to your account</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
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
              placeholder="Enter your password"
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
              : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}