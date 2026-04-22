"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import RoleGuard from "@/components/guards/RoleGuard";
import Alert from "@/components/feedback/Alert";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateBookPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    isbn: "",
    title: "",
    author: "",
    description: "",
    genre: "fiction",
    publishedDate: "",
    quantity: 1,
    price: 0,
    coverImg: ""
  });

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price"
          ? Number(value)
          : value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await apiRequest("/books", {
        method: "POST",
        body: {
          ...form,
          publishedDate: new Date(form.publishedDate)
        }
      });

      setSuccess("Book created successfully");

      setTimeout(() => {
        router.push("/books");
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to create book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
        <SectionHeader
          title="Create Book"
          subtitle="Add a new book to the inventory"
        />

        {error && <Alert variant="error" message={error} />}
        {success && <Alert variant="success" message={success} />}

        <form onSubmit={handleSubmit} className="panel space-y-4">

          {/* ISBN */}
          <div>
            <label className="block mb-1 font-medium">ISBN</label>
            <input
              className="input"
              name="isbn"
              value={form.isbn}
              onChange={updateField}
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              className="input"
              name="title"
              value={form.title}
              onChange={updateField}
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block mb-1 font-medium">Author</label>
            <input
              className="input"
              name="author"
              value={form.author}
              onChange={updateField}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="input"
              name="description"
              value={form.description}
              onChange={updateField}
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block mb-1 font-medium">Genre</label>
            <select
              className="input"
              name="genre"
              value={form.genre}
              onChange={updateField}
            >
              <option value="fiction">Fiction</option>
              <option value="non_fiction">Non Fiction</option>
            </select>
          </div>

          {/* Published Date */}
          <div>
            <label className="block mb-1 font-medium">Published Date</label>
            <input
              className="input"
              type="date"
              name="publishedDate"
              value={form.publishedDate}
              onChange={updateField}
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              className="input"
              type="number"
              name="quantity"
              min={1}
              value={form.quantity}
              onChange={updateField}
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              className="input"
              type="number"
              name="price"
              min={0}
              step="0.01"
              value={form.price}
              onChange={updateField}
              required
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-1 font-medium">
              Cover Image URL (optional)
            </label>
            <input
              className="input"
              name="coverImg"
              value={form.coverImg}
              onChange={updateField}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-secondary w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Book"}
          </button>
        </form>
      </RoleGuard>
    </PageShell>
  );
}