"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard", num: "01" },
  { href: "/admin/events", label: "Events", num: "02" },
  { href: "/admin/blog", label: "Blog Posts", num: "03" },
  { href: "/admin/board", label: "Board Members", num: "04" },
  { href: "/admin/copy", label: "Site Copy", num: "05" },
  { href: "/admin/photos", label: "Photos", num: "06" },
  { href: "/admin/settings", label: "Site Settings", num: "07" },
];

export function AdminSidebar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try { await signOut(firebaseAuth); } catch {}
    await fetch("/api/session", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="admin-side">
      <div>
        <div className="brand">Topeka <em>Model</em><br />Railroaders</div>
        <div className="sub">Station Master · Admin</div>
      </div>
      <hr />
      <nav>
        {LINKS.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={active ? "active" : ""}>
              {l.label} <span className="num">{l.num}</span>
            </Link>
          );
        })}
      </nav>
      <hr />
      <div className="who">
        <div className="name">{name || "Editor"}</div>
        <div className="role">{role}</div>
        <div className="links">
          <Link href="/">← Site</Link>
          <button type="button" className="logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>
    </aside>
  );
}
