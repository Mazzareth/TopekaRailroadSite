import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin/settings");

  return (
    <SettingsClient
      isAdmin={user.role === "admin"}
      currentUserName={user.name}
      currentUserEmail={user.email}
    />
  );
}
