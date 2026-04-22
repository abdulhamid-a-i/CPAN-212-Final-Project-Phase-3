"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProtectedRoute from "@/components/guards/ProtectedRoute";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import { apiRequest } from "@/lib/api";
import type { Book } from "@/types/book";

export default function BookViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    async function load() {
      const response = await apiRequest<Book>(`/books/${id}`);
      setBook(response.data);
    }

    if (id) void load();
  }, [id]);

  return (
    <ProtectedRoute>
      <PageShell>
        <SectionHeader
          title="Book Details"
          subtitle=""
        />

        {book ? (
          <div className="flex justify-center">
            <div
              className="panel"
              style={{
                maxWidth: "700px",
                width: "100%",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start"
              }}
            >
              {/* Cover */}
              <div style={{ flexShrink: 0 }}>
                {book.coverImg ? (
                  <img
                    src={book.coverImg}
                    alt={book.title}
                    style={{
                      width: "160px",
                      height: "240px",
                      objectFit: "cover",
                      borderRadius: "10px"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "160px",
                      height: "240px",
                      background: "#e5e7eb",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280"
                    }}
                  >
                    No Cover
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: "8px" }}>{book.title}</h2>

                <p style={{ marginBottom: "6px" }}>
                  <strong>Author:</strong> {book.author}
                </p>

                <p style={{ marginBottom: "6px" }}>
                  <strong>ISBN:</strong> {book.isbn}
                </p>

                <p style={{ marginBottom: "6px" }}>
                  <strong>Genre:</strong> {book.genre}
                </p>

                <p style={{ marginBottom: "6px" }}>
                  <strong>Published:</strong>{" "}
                  {new Date(book.publishedDate).toLocaleDateString()}
                </p>

                <p style={{ marginBottom: "6px" }}>
                  <strong>Quantity:</strong> {book.quantity}
                </p>

                <p style={{ marginBottom: "6px" }}>
                  <strong>Price:</strong> ${book.price}
                </p>

                {book.description && (
                  <p style={{ marginTop: "10px" }} className="text-neutral-300">
                    {book.description}
                  </p>
                )}

                {/* Actions */}
                <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => router.push(`/books/${id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => router.push("/books")}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </PageShell>
    </ProtectedRoute>
  );
}