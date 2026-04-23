"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  UserCircle,
  Store,
  FileText,
  Boxes,
  Users,
  KeyRound,
  BookOpenText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function getRoleNames(roles: unknown[] | undefined): string[] {
  return (roles || []).map((role) => {
    if (typeof role === "string") {
      return role;
    }

    if (role && typeof role === "object" && "name" in role) {
      return String((role as { name?: string }).name || "");
    }

    return String(role);
  });
}

export default function Sidebar() {
  const { user } = useAuth();
  const roleNames = getRoleNames(user?.roles);

  const isAdmin = roleNames.includes("ADMIN");
  const isCustomer = roleNames.includes("CUSTOMER");

  const canEmployeeSide = !isCustomer;
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <BookOpenText size={22} />
        </div>
        <div>
          <h1>Bookaneers</h1>
          <p></p>
        </div>
      </div>

      <nav className="nav-links">

        <Link href="/shop">
          <Store size={16} />
          Online Shop
        </Link>

        <Link href="/profile">
          <UserCircle size={16} />
          Profile
        </Link>

        {/* From here will be the Employee side of the store */}
        {canEmployeeSide && (
          <>
          <Link href="/books">
            <FileText size={16} />
            Books Management
          </Link>
          <Link href="/dashboard">
          <LayoutDashboard size={16} />
          Dashboard
          </Link>
          <Link href="/shipment">
          <Boxes size={16} />
          Shipments
          </Link>
          </>
          
        )}

        {isAdmin && (
          <>
            <Link href="/admin/users">
              <Users size={16} />
              Admin Users
            </Link>
  
            <Link href="/admin/rbac">
              <KeyRound size={16} />
              RBAC
            </Link>
            <Link href="/admin/account-status">
              <Users size={16} />
              Account Status
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}