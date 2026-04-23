"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Alert from "@/components/feedback/Alert";

export interface BookFormValues {
  isbn: string;
  title: string;
  author: string;
  description: string;
  genre: "fiction" | "non_fiction";
  publishedDate: string;
  quantity: string;
  price: string;
  coverImg: string;
}

interface BookFormProps {
  onSubmit: (payload: BookFormValues) => Promise<void>;
  initialValues?: Partial<BookFormValues>;
  submitLabel?: string;
}

const defaultValues: BookFormValues = {
  isbn: "",
  title: "",
  author: "",
  description: "",
  genre: "fiction",
  publishedDate: "",
  quantity: "",
  price: "",
  coverImg: ""
};

export default function BookForm({
  onSubmit,
  initialValues,
  submitLabel = "Save Book"
}: BookFormProps) {
  const resolvedInitialValues = useMemo(
    () => ({ ...defaultValues, ...initialValues }),
    [initialValues]
  );

  const [form, setForm] = useState<BookFormValues>(resolvedInitialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(resolvedInitialValues);
  }, [resolvedInitialValues]);

  function updateField<K extends keyof BookFormValues>(
    field: K,
    value: BookFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div>
        <label>ISBN</label>
        <input
          value={form.isbn}
          onChange={(e) => updateField("isbn", e.target.value)}
          required
        />
      </div>

      <div>
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />
      </div>

      <div>
        <label>Author</label>
        <input
          value={form.author}
          onChange={(e) => updateField("author", e.target.value)}
          required
        />
      </div>

      <div className="full-span">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div>
        <label>Genre</label>
        <select
          value={form.genre}
          onChange={(e) =>
            updateField("genre", e.target.value as BookFormValues["genre"])
          }
        >
          <option value="fiction" >Fiction</option>
          <option value="non_fiction">Non Fiction</option>
        </select>
      </div>

      <div>
        <label>Published Date</label>
        <input
          type="date"
          value={form.publishedDate}
          onChange={(e) => updateField("publishedDate", e.target.value)}
          required
        />
      </div>

      <div>
        <label>Quantity</label>
        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => updateField("quantity", e.target.value)}
          required
        />
      </div>

      <div>
        <label>Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          required
        />
      </div>

      <div className="full-span">
        <label>Cover Image URL</label>
        <input
          value={form.coverImg}
          onChange={(e) => updateField("coverImg", e.target.value)}
        />
      </div>

      {error && (
        <div className="full-span">
          <Alert variant="error" message={error} />
        </div>
      )}

      <div className="full-span">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}