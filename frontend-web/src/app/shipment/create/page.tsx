"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import RoleGuard from "@/components/guards/RoleGuard";
import Alert from "@/components/feedback/Alert";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CreateShipmentPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Only CSV files are allowed");
      return;
    }

    setFile(selectedFile);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setError("CSV file is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/shipments`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to create shipment");
      }

      router.push("/shipment");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
        <PageShell>
        <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
            <SectionHeader
            title="Create Shipment"
            subtitle="Upload a CSV file to generate a new shipment"
            />

            {error && <Alert variant="error" message={error} />}

            <form
            onSubmit={handleSubmit}
            className="panel mt-5 space-y-4 max-w-xl"
            >
            {/* CSV File Upload */}
            <div>
                <label className="block mb-1 font-medium">
                CSV File
                </label>

                <input
                className="input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                />

                {file && (
                <p className="text-sm text-gray-500 mt-1">
                    Selected file: {file.name}
                </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="btn btn-secondary"
                disabled={loading}
            >
                {loading ? "Uploading..." : "Create Shipment"}
            </button>
            </form>
        </RoleGuard>
        </PageShell>
    </ProtectedRoute>
  );
}