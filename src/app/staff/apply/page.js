import Link from "next/link";
import { redirect } from "next/navigation";
import { currentSemester } from "@/lib/utils";
import { getSession } from "@/server/dal";
import StaffApplyForm from "./StaffApplyForm";

export const metadata = { title: "Core & EC account" };

export default async function StaffApplyPage() {
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");
  if (session) redirect(session.status === "approved" ? "/me" : "/staff/setup");

  return (
    <main className="dash-auth">
      <div className="dash-auth-card">
        <p className="eyebrow">CORE & EXECUTIVE COUNCIL</p>
        <h1 className="headline">Request a desk</h1>
        <p className="body">
          Create your account, then set up your profile with a portrait and a short bio. Admin reviews it, and
          once approved you appear on the Leadership page in your place: Directorates, Leads, then Co-Leads.
        </p>
        <StaffApplyForm semester={currentSemester()} />
        <p className="body">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
