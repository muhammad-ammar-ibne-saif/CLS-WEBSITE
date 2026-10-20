import Link from "next/link";
import { redirect } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import SubmitButton from "@/components/admin/SubmitButton";
import { logoutAction } from "@/server/actions/auth";
import { ACCOUNT_STATUS, DEPARTMENTS, EC_RANK_LABELS, EC_RANK_ORDER, TEAMS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { User } from "@/models/User";
import { updateProfileAction } from "@/server/actions/profile";
import { requireApplicant } from "@/server/dal";

export const metadata = { title: "Set up your profile" };
export const dynamic = "force-dynamic";

export default async function StaffSetupPage() {
  const session = await requireApplicant();
  if (session.status === ACCOUNT_STATUS.APPROVED) redirect("/me");
  await connectDb();
  const user = toPlain(await User.findById(session._id).select("-passwordHash").lean());
  const isEc = user.team === TEAMS.EC;

  return (
    <main className="dash-auth">
      <div className="dash-auth-card">
        <p className="eyebrow">{isEc ? "EXECUTIVE COUNCIL" : "CORE TEAM"}</p>
        <h1 className="headline">Set up your profile</h1>
        <p className="setup-banner">
          Your account is waiting for admin approval. You can edit everything below until then. Once approved,
          this profile goes live on the Leadership page.
        </p>
        <ActionForm action={updateProfileAction} className="form" successText="Saved. Admin will review it.">
          <MediaField name="avatar" label="Portrait" defaultValue={user.avatar} />
          <label>
            Headline
            <input name="headline" defaultValue={user.headline} maxLength={240} />
          </label>
          <label>
            Bio
            <textarea name="bio" defaultValue={user.bio} maxLength={4000} />
          </label>
          <label>
            Title on the page
            <input name="office" defaultValue={user.office} maxLength={80} />
          </label>
          {isEc ? (
            <label>
              Executive Council position
              <select name="ecRank" required defaultValue={user.ecRank || ""}>
                <option value="" disabled>
                  Choose Director, Lead or Co-Lead
                </option>
                {EC_RANK_ORDER.map((rank) => (
                  <option key={rank} value={rank}>
                    {EC_RANK_LABELS[rank]}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label>
            Department
            <select name="department" defaultValue={user.department}>
              {DEPARTMENTS.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </label>
          <label>
            Instagram
            <input name="instagram" defaultValue={user.socials?.instagram} />
          </label>
          <label>
            Facebook
            <input name="facebook" defaultValue={user.socials?.facebook} />
          </label>
          <label>
            Website
            <input name="website" defaultValue={user.socials?.website} />
          </label>
          <SubmitButton pendingText="Saving">Save profile</SubmitButton>
        </ActionForm>
        <form action={logoutAction}>
          <button className="btn" type="submit">
            Sign out
          </button>
        </form>
        <p className="body">
          <Link href="/">Back to the society</Link>
        </p>
      </div>
    </main>
  );
}
