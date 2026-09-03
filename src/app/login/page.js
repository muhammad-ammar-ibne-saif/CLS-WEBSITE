import Link from "next/link";
import { loginAction } from "@/server/actions/auth";
import ActionForm from "@/components/admin/ActionForm";
import { getSession } from "@/server/dal";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");
  if (session?.status === "approved") redirect("/me");

  return (
    <main className="dash-auth">
      <div className="dash-auth-card">
        <p className="eyebrow">CLS DESK</p>
        <h1 className="headline">Sign in</h1>
        <p className="body">Admin, Core, and EC use the same door. Public members still join from Register.</p>
        <ActionForm action={loginAction} className="form" successText="">
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" required minLength={8} />
          </label>
          <button className="btn btn-outline" type="submit">
            Enter
          </button>
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
