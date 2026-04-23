"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import StatCard from "@/components/dashboard/StatCard";
import { apiRequest } from "@/lib/api";
import DataTable, { type DataTableColumn } from "@/components/tables/DataTable";
import RoleGuard from "@/components/guards/RoleGuard";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import type { Book } from "@/types/book";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Alert from "@/components/feedback/Alert";

type DashboardSummary = {
  fiction: number;
  non_fiction: number;
};

function getRoleNames(roles: unknown[] | undefined): string[] {
  return (roles || []).map((role) => {
    if (typeof role === "string") return role;

    if (role && typeof role === "object" && "name" in role) {
      return String((role as { name?: string }).name || "");
    }

    return String(role);
  });
}

export default function BookDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const [summary, setSummary] = useState<DashboardSummary>({
    fiction: 0,
    non_fiction: 0
  });

  const [books, setBooks] = useState<Book[]>([]);

  // filters
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");

  const roleNames = useMemo(
    () => getRoleNames(user?.roles),
    [user?.roles]
  );

  const isAdmin = roleNames.includes("ADMIN");
  const isManager = roleNames.includes("MANAGER");
  const canSee = isAdmin || isManager;

  const loadData = async () => {
    try {
      const summaryRes = await apiRequest<DashboardSummary>(
        "/dashboard/book-summary"
      );
      setSummary(summaryRes.data);

      const params = new URLSearchParams();

      if (q.trim()) params.append("q", q.trim());
      if (genre) params.append("genre", genre);

      const res = await apiRequest<{ books: Book[] }>(
        `/books?${params.toString()}`
      );

      setBooks(res.data.books);
    } catch (err: any) {
      setShowError(true);
      setError(err.message || "Failed to load books");
    }
  };

  useEffect(() => {
    void loadData();
  }, [q, genre]);

  async function handleDelete(id: string) {
    try {
      await apiRequest(`/books/${id}`, { method: "DELETE" });
    } catch (err: any) {
      setShowError(true);
      setError(err.message || "Delete failed");
    }

    await loadData();
  }

  const columns: DataTableColumn<Book>[] = [
    {
      key: "title",
      label: "Title",
      render: (row) => row.title
    },
    {
      key: "genre",
      label: "Genre",
      render: (row) => row.genre
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (row) => row.quantity
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          {canSee && (
            <>
              <button
                className="btn btn-secondary w-25 hover:bg-amber-950! transition"
                onClick={() => router.push(`books/${row._id}`)}
              >
                View
              </button>

              <button
                className="btn btn-secondary w-25 hover:bg-amber-950! transition ml-2"
                onClick={() => router.push(`books/${row._id}/edit`)}
              >
                Edit
              </button>

              <button
                className="btn bg-(--danger) w-25 ml-2 hover:bg-red-950 transition"
                onClick={() => handleDelete(row._id)}
              >
                Delete
              </button>
            </>
          )}
        </>
      )
    }
  ];

  return (
    <ProtectedRoute>
      <PageShell>
        <RoleGuard allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
          <SectionHeader
            title="Books Dashboard"
            subtitle="Search, filter, and manage shipment Books"
          />

          {showError && (
            <Alert variant="error" message={error} />
          )}
          {canSee && (<>
         <button className="btn btn-secondary mb-5 hover:bg-amber-950! transition" onClick={() => router.push("/books/create")}>Create</button>
        </>)}

          {/* SUMMARY */}
          <DashboardGrid>
            <StatCard title="Fiction" value={summary.fiction} />
            <StatCard title="Non Fiction" value={summary.non_fiction} />
          </DashboardGrid>

          {/* FILTERS */}
          <div className="panel mt-5 flex gap-3">
            <input
              className="input"
              placeholder="Search books..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select
              className="input"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              <option value="fiction">Fiction</option>
              <option value="non_fiction">Non Fiction</option>
            </select>

            <button
              className="btn btn-secondary"
              onClick={() => {
                setQ("");
                setGenre("");
              }}
            >
              Clear
            </button>
          </div>

          {/* TABLE */}
          <div className="panel mt-5">
            {books.length === 0 ? (
              <p className="text-gray-500">
                No books found for current filters.
              </p>
            ) : (
              <DataTable
                columns={columns}
                data={books}
                rowKey={(row) => row._id}
              />
            )}
          </div>
        </RoleGuard>
      </PageShell>
    </ProtectedRoute>
  );
}