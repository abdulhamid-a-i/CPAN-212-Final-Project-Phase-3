"use client";

import { BookOpenText } from 'lucide-react';
import { useRouter } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL environment variable");
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin(username: string, password: string) {
    await login(username, password);
    router.push("/shop");
  }

  function handleKeycloakLogin() {
    window.location.href = `${API_BASE_URL}/auth/keycloak/login`;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-badge">
            <BookOpenText size={22} />
          </div>
          <div>
            <h1>Bookaneers</h1>
            {/* <p>Secure digital Shopping and inventory management platform</p> */}
          </div>
        </div>

        <LoginForm onSubmit={handleLogin} />
        <button className="btn btn-secondary mt-5" 
        onClick={() => router.push("/register")}
        style={{ width: "100%" }}
        >
        Register
        </button>

        <div className="demo-box">
          <h3>Demo accounts</h3>
          <p>admin1 / Password123!</p>
          <p>customer1 / Password123!</p>
        </div>

        <div className="demo-box">
          <h3>Single Sign-On</h3>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleKeycloakLogin}
            style={{ width: "100%" }}
          >
            Sign in with Keycloak
          </button>
        </div>
      </div>
    </div>
  );
}