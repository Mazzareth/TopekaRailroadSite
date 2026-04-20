import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (!canAccessAdmin(user)) redirect("/?forbidden=1");

  const roleLabel = user.role === "admin" ? "Station Master" : "Editor";
  const display = user.name || user.email || "Member";

  return (
    <div className="admin-wrap">
      <AdminSidebar name={display} role={roleLabel} />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="crumb">
            Admin <span style={{ opacity: 0.4 }}> ▸ </span> <strong>Console</strong>
          </div>
          <div className="crumb">
            Signed in as <strong>{display}</strong> · <span className="mono">{roleLabel}</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
