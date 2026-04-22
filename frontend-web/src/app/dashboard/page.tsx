"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import StatCard from "@/components/dashboard/StatCard";
import { apiRequest } from "@/lib/api";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import RoleGuard from "@/components/guards/RoleGuard";

type DashboardSummary = {
  books: number;
  shipments: number;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({
    books: 0,
    shipments: 0
  });

  useEffect(() => {
    async function load() {
      const response = await apiRequest<DashboardSummary>("/dashboard/summary");
      setSummary(response.data);
    }

    void load();
  }, []);

  return (
  <ProtectedRoute>
    <PageShell>
      <RoleGuard allowedRoles={["EMPLOYEE","ADMIN","MANAGER"]}>
      <SectionHeader
        title="Employee Dashboard"
        subtitle="Books & shipments overview"
      />

      <DashboardGrid>
        <StatCard title="Books" value={summary.books} />
        <StatCard title="Shipments" value={summary.shipments} />
      </DashboardGrid>
      </RoleGuard>
    </PageShell>
   </ProtectedRoute>
  );
}