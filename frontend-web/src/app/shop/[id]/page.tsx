"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProtectedRoute from "@/components/guards/ProtectedRoute";
import StoreShell from "@/components/layout/StoreShell";
import SectionHeader from "@/components/layout/SectionHeader";
import Alert from "@/components/feedback/Alert";

import { apiRequest } from "@/lib/api";
import type { Book } from "@/types/book";

export default function BookViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [showSuccess, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");

  const [showError, setError] = useState(false);
  const [errText, setErrText] = useState("");

  useEffect(() => {
    async function load() {
      const response = await apiRequest<Book>(`/books/${id}`);
      setBook(response.data);
    }

    if (id) void load();
  }, [id]);

  const addToCart = async () => {
    if (!book) return;

    try {
      const res = await apiRequest("/cart/add", {
        method: "PUT",
        body: {
          bookId: book._id,
          quantity
        }
      });

      setMsg(res.message || "Added to cart");
      setSuccess(true);
      setError(false);
    } catch (err) {
      setError(true);
      setErrText((err as Error).message);
    }
  };

  return (
    <ProtectedRoute>
      <StoreShell>
        <SectionHeader
          title="Book Details"
          subtitle="View details and purchase this book"
        />

        {showSuccess && (
          <Alert variant="success" message={msg} />
        )}

        {showError && (
          <Alert variant="error" message={errText} />
        )}

        {book ? (
          <div className="flex justify-center">
            <div
              className="panel"
              style={{
                maxWidth: "750px",
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
                      width: "170px",
                      height: "260px",
                      objectFit: "cover",
                      borderRadius: "10px"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "170px",
                      height: "260px",
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
                <h2 style={{ marginBottom: "6px" }}>{book.title}</h2>

                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p>
                  <strong>Published:</strong>{" "}
                  {new Date(book.publishedDate).toLocaleDateString()}
                </p>

                <p><strong>In Stock:</strong> {book.quantity}</p>
                <p><strong>Price:</strong> ${book.price}</p>

                {book.description && (
                  <p style={{ marginTop: "10px", color: "#4b5563" }}>
                    {book.description}
                  </p>
                )}

                {/* Quantity selector */}
                <div style={{ marginTop: "15px" }}>
                  <label><strong>Quantity</strong></label>
                  <input
                    type="number"
                    min="1"
                    max={book.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{
                      display: "block",
                      marginTop: "5px",
                      padding: "6px",
                      width: "80px"
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={addToCart}
                    disabled={book.quantity === 0}
                  >
                    Add to Cart
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
      </StoreShell>
    </ProtectedRoute>
  );
}