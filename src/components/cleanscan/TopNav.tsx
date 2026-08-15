import { Link } from "@tanstack/react-router";

export function TopNav() {
  return (
    <nav
      className="inline-flex gap-1 rounded-[12px] p-1"
      style={{ backgroundColor: "var(--card)", boxShadow: "var(--shadow-soft)" }}
    >
      {[
        { to: "/", label: "Map" },
        { to: "/priority", label: "Priority List" },
      ].map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: true }}
          className="rounded-[9px] px-3.5 py-1.5 text-[14px] font-medium text-muted transition-colors"
          activeProps={{
            style: { backgroundColor: "rgba(138,138,142,0.12)", color: "var(--ink)" },
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
