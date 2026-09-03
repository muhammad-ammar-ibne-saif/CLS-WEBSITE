import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import { DEPARTMENTS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { User } from "@/models/User";
import { updateProfileAction } from "@/server/actions/profile";
import { requireStaff } from "@/server/dal";

export const metadata = { title: "My profile" };

export default async function MePage() {
  const session = await requireStaff();
  await connectDb();
  const user = toPlain(await User.findById(session._id).lean());

  return (
    <DashShell title="Your public profile" user={user} nav="me">
      {user.slug ? (
        <p className="body">
          Live page: <Link href={`/members/${user.slug}`}>/members/{user.slug}</Link>
        </p>
      ) : null}
      <ActionForm action={updateProfileAction} className="form dash-form">
        <MediaField name="avatar" label="Portrait" defaultValue={user.avatar} />
        <label>
          Headline
          <input name="headline" defaultValue={user.headline} />
        </label>
        <label>
          Bio
          <textarea name="bio" defaultValue={user.bio} />
        </label>
        <label>
          Office
          <input name="office" defaultValue={user.office} />
        </label>
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
        <button className="btn btn-outline" type="submit">
          Save profile
        </button>
      </ActionForm>
    </DashShell>
  );
}
