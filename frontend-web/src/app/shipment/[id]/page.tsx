"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import RoleGuard from "@/components/guards/RoleGuard";
import Alert from "@/components/feedback/Alert";
import StatusBadge from "@/components/tables/StatusBadge";
import { apiRequest } from "@/lib/api";
import { useParams } from "next/navigation";
import type { Shipment } from "@/types/shipment";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

const SHIPMENT_TRANSITIONS: Record<string, string[]> = {
  ORDERED: ["ARRIVED"],
  ARRIVED: ["PROCESSED"],
  PROCESSED: []
};

export default function ShipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<{
    updated: number;
    skipped: number;
  } | null>(null);

  async function loadShipment() {
    try {
      setPageLoading(true);
      setError("");

      const res = await apiRequest<Shipment>(`/shipments/${id}`);

      setShipment(res.data);
      setStatus(res.data.status);
    } catch (err: any) {
      setError(err.message || "Failed to load shipment");
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    if (id) void loadShipment();
  }, [id]);

  const allowedStatuses = useMemo(() => {
    if (!shipment) return [];
    return SHIPMENT_TRANSITIONS[shipment.status] ?? [];
  }, [shipment]);

  async function updateStatus() {
    try {
      setLoading(true);
      setError("");
      setSummary(null);

      const response = await apiRequest(`/shipments/${id}/status`, {
        method: "PATCH",
        body: { status }
      });

      // Show backend processing summary ONLY when processed
      if (status === "PROCESSED") {
        setSummary({
          updated: response.data.updated,
          skipped: response.data.skipped
        });
      }

      await loadShipment();
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <PageShell>
        <p className="text-gray-500">Loading shipment...</p>
      </PageShell>
    );
  }

  if (!shipment) {
    return (
      <PageShell>
        <Alert variant="error" message="Shipment not found" />
      </PageShell>
    );
  }

  return (
<ProtectedRoute>
    <PageShell>
      <RoleGuard allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
        <SectionHeader
          title={shipment.title}
          subtitle="Shipment details and inventory processing"
        />

        {error && <Alert variant="error" message={error} />}

        {/* STATUS CONTROL */}
        <div className="panel mb-5">
          <div className="flex items-center gap-4">
            <StatusBadge value={shipment.status} />

            <select
              className="input w-52"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={allowedStatuses.length === 0}
            >
              <option value={shipment.status}>
                {shipment.status} (current)
              </option>

              {allowedStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              className="btn btn-secondary"
              onClick={updateStatus}
              disabled={
                loading ||
                status === shipment.status ||
                allowedStatuses.length === 0
              }
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>

          {allowedStatuses.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No further transitions available.
            </p>
          )}
        </div>

        {/* PROCESSING SUMMARY */}
        {summary && (
          <div className="panel mb-5 border border-green-600">
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Shipment Processing Complete
            </h3>

            <p>Books updated: {summary.updated}</p>
            <p>Items skipped: {summary.skipped}</p>

            <p className="text-sm text-gray-500 mt-2">
              Inventory has been updated successfully.
            </p>
          </div>
        )}

        {/* CONTENTS */}
        <div className="panel">
          <h2 className="text-lg font-semibold mb-3">
            Shipment Contents
          </h2>

          {shipment.contents.length === 0 ? (
            <p className="text-gray-500">No items in this shipment.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">ISBN</th>
                  <th>Title</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {shipment.contents.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{item.isbn}</td>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </RoleGuard>
    </PageShell>
</ProtectedRoute>
  );
}