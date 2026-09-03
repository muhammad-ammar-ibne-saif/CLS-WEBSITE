import Link from "next/link";
import ActionForm from "@/components/admin/ActionForm";
import { DEPARTMENTS, TEAMS } from "@/config/constants";
import { applyStaffAction } from "@/server/actions/auth";
import { currentSemester } from "@/lib/utils";

export const metadata = { title: "Core & EC account" };

export default function StaffApplyPage() {
  return (
    <main className="dash-auth">
      <div className="dash-auth-card">
        <p className="eyebrow">CORE & EXECUTIVE COUNCIL</p>
        <h1 className="headline">Request a desk</h1>
        <p className="body">
          Every Core and EC member creates an account here. Admin approves the profile; then your portrait
          can open a public page for memories and work.
        </p>
        <ActionForm action={applyStaffAction} className="form" successText="Request received. Wait for admin approval, then sign in.">
          <label>
            Full name
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" required minLength={8} />
          </label>
          <label>
            Team
            <select name="team" required defaultValue={TEAMS.CORE}>
              <option value={TEAMS.CORE}>Core team</option>
              <option value={TEAMS.EC}>Executive Council</option>
            </select>
          </label>
          <label>
            Department
            <select name="department" required>
              {DEPARTMENTS.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </label>
          <label>
            Office / title
            <input name="office" placeholder="President, Urdu Director…" />
          </label>
          <label>
            Semester
            <input name="semester" defaultValue={currentSemester()} />
          </label>
          <label>
            Roll number
            <input name="rollNumber" />
          </label>
          <label>
            Why this desk
            <textarea name="why" required />
          </label>
          <button className="btn btn-outline" type="submit">
            Submit for approval
          </button>
        </ActionForm>
        <p className="body">
          Already approved? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
