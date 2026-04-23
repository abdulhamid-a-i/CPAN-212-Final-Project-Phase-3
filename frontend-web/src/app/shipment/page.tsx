"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import DataTable, { type DataTableColumn } from "@/components/tables/DataTable";
import RoleGuard from "@/components/guards/RoleGuard";
import { apiRequest } from "@/lib/api";
import type { Shipment } from "@/types/shipment";
import StatusBadge from "@/components/tables/StatusBadge";
import Alert from "@/components/feedback/Alert";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import StatCard from "@/components/dashboard/StatCard";

type DashboardSummary = {
  ordered: number;
  arrived: number;
  processed: number;
};

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

export default function ShipmentsDashboard() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");

  const [summary, setSummary] = useState<DashboardSummary>({
      ordered: 0,
      arrived: 0,
      processed: 0
    });

  const router = useRouter();

  const roleNames = useMemo(() => getRoleNames(user?.roles), [user?.roles]);

  const isAdmin = roleNames.includes("ADMIN");
  const isManager = roleNames.includes("MANAGER");

  const canSee = isAdmin || isManager

  const loadShipments = async () => {
    try {
      setLoading(true);
      setError("");

      const summaryRes = await apiRequest<DashboardSummary>(
              "/dashboard/shipment-summary"
            );
            setSummary(summaryRes.data);

      const params = new URLSearchParams();

      if (status) params.append("status", status);
      if (q) params.append("q", q);

      const response = await apiRequest<{
        shipments: Shipment[];
      }>(`/shipments?${params.toString()}`);

      setShipments(response.data.shipments);
    } catch (err: any) {
      setError(err.message || "Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadShipments();
  }, [status, q]);

  async function handleDelete(id: string) {
    try {
      await apiRequest(`/shipments/${id}`, {
        method: "DELETE"
      });

      await loadShipments();
    } catch (err: any) {
      setError(err.message || "Failed to delete shipment");
    }
  }

  const columns: DataTableColumn<Shipment>[] = [
    {
      key: "title",
      label: "Title",
      render: (row) => row.title
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge value={row.status} />
    },
    {
      key: "items",
      label: "Items",
      render: (row) => `${row.contents.length} items`
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString("en-GB")
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
        <div className="flex gap-2">
            <button
                className="btn btn-secondary hover:bg-amber-950 transition"
                onClick={() => router.push(`/shipment/${row._id}`)}
            >
                View
            </button>
            {canSee && (
                <>
           {!(row.status == "ARRIVED") ? (
             <button
                className="btn bg-(--danger) hover:bg-red-950 transition"
                onClick={() => handleDelete(row._id)}
            >
                Delete
            </button>
           ) : (<></>)}

           </>
            
            ) }
        </div>
        </>
      )
    }
  ];

  return (
    <ProtectedRoute>
    <PageShell>
      <RoleGuard allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
        <SectionHeader
          title="Shipments Dashboard"
          subtitle="Search, filter, and manage shipment orders"
        />

        {error && <Alert variant="error" message={error} />}
        {canSee && (<>
         <button className="btn btn-secondary mb-5" onClick={() => router.push("/shipment/create")}>Create</button>
        </>)}

        <DashboardGrid>
                    <StatCard title="Ordered" value={summary.ordered} />
                    <StatCard title="Arrived" value={summary.arrived} />
                    <StatCard title="Processed" value={summary.processed} />
        </DashboardGrid>
       

        {/* Filters */}
        <div className="flex gap-3 mt-5 mb-4">
          <input
            className="input"
            placeholder="Search shipments by books..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ORDERED">Ordered</option>
            <option value="ARRIVED">Arrived</option>
            <option value="PROCESSED">Processed</option>
          </select>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-gray-500 mt-4">Loading shipments...</div>
        )}

        {/* Empty state */}
        {!loading && shipments.length === 0 && (
          <div className="text-gray-500 mt-6">
            No shipments found.
          </div>
        )}

        {/* Table */}
        {!loading && shipments.length > 0 && (
          <div className="panel mt-5">
            <DataTable
              columns={columns}
              data={shipments}
              rowKey={(row) => row._id}
            />
          </div>
        )}
      </RoleGuard>
    </PageShell>
</ProtectedRoute>
  );
}