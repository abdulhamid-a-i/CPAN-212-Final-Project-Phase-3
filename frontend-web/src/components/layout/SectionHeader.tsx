import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div
      className="page-header"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap"
      }}
    >
      <div>
        <h1 className="text-3xl">{title}</h1>
        {subtitle ? <p className="text-2xl">{subtitle}</p> : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}