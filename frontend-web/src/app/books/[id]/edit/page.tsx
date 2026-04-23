"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import ProtectedRoute from "@/components/guards/ProtectedRoute";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import BookForm from "@/components/forms/BookForm";
import { apiRequest } from "@/lib/api";

import type { Book } from "@/types/book";

export default function EditBookPage() {
  const [book, setBook] = useState<Book | null>(null);
  const router = useRouter();
  const params = useParams();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function load() {
      const response = await apiRequest<Book>(`/books/${id}`);
      setBook(response.data);
    }

    if (id) void load();
  }, [id]);

  async function handleSubmit(payload: any) {
    await apiRequest(`/books/${id}/update`, {
      method: "PUT",
      body: payload
    });

    router.push("/books");
  }

  return (
    <ProtectedRoute>
      <PageShell>
        <SectionHeader
          title="Edit Book"
          subtitle="Update book details in your library."
        />

        {book ? (
          <BookForm
            initialValues={{
              isbn: book.isbn,
              title: book.title,
              author: book.author,
              description: book.description ?? "",
              genre: book.genre,
              publishedDate: book.publishedDate
                ? book.publishedDate.toString().slice(0, 10)
                : "",
              quantity: String(book.quantity),
              price: String(book.price),
              coverImg: book.coverImg ?? ""
            }}
            submitLabel="Update Book"
            onSubmit={handleSubmit}
          />
        ) : null}
      </PageShell>
    </ProtectedRoute>
  );
}