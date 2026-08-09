"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      alert("Registration successful!");

      router.push("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);

      alert(
        error.response?.data ||
          "Registration failed. Please try again."
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
        <h1>📝 Create Account</h1>

        <p>Create your customer account</p>

        <form onSubmit={handleRegister}>

          <div style={{ marginBottom: "15px" }}>
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
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

          <div style={{ marginBottom: "15px" }}>
            <label>Phone</label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter your phone number"
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
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
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
            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm password"
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
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>
      </div>
    </main>
  );
}