import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import StoreTopbar from "./StoreTopbar";

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content-shell">
        <StoreTopbar />
        <section className="content-panel">{children}</section>
      </main>
    </div>
  );
}