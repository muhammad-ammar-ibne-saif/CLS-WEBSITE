import Link from "next/link";
import { loginAction } from "@/server/actions/auth";
import ActionForm from "@/components/admin/ActionForm";
import SubmitButton from "@/components/admin/SubmitButton";
import { getSession } from "@/server/dal";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");
  if (session?.status === "approved") redirect("/me");
  if (session?.status === "pending") redirect("/staff/setup");

  return (
    <main className="dash-auth">
      <div className="dash-auth-card">
        <p className="eyebrow">CLS DESK</p>
        <h1 className="headline">Sign in</h1>
        <p className="body">Admin, Core, and EC use the same door. Public members join from Register.</p>
        <ActionForm action={loginAction} className="form" successText="">
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Password
            <input name="password" type="password" required minLength={8} maxLength={72} autoComplete="current-password" />
          </label>
          <SubmitButton pendingText="Signing in">Enter</SubmitButton>
        </ActionForm>
        <p className="body">
          Core or EC for this semester? <Link href="/staff/apply">Request an account</Link>
        </p>
        <p className="body">
          <Link href="/">Back to the society</Link>
        </p>
      </div>
    </main>
  );
}
