"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart } from 'lucide-react';

export default function StoreTopbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

    const handleLogout = async () => {
    await logout();

    // Only redirect for LOCAL logout
    // For KEYCLOAK logout, backend will handle redirect
    const authMode = localStorage.getItem("authMode");

    
      router.push("/login");
    
  };

  return (
    <header className="topbar">
      <div>
        <h2>Bookaneers Online Store</h2>
      </div>

      <div className="flex gap-3">

        <button
        className="btn btn-secondary w-20 flex items-center justify-center hover:bg-amber-600! transition duration-150"
        onClick={() => {
          router.push("/shop/cart");
        }}
      ><ShoppingCart size={25} /></button>
      
      <button
        className="btn btn-secondary w-20 flex items-center justify-center hover:bg-amber-600! transition duration-150"
        onClick={handleLogout}
      >
        Logout
      </button>
      </div>
      
    </header>
  );
}