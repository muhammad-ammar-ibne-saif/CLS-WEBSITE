import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import { connectDb } from "@/lib/db";
import { ACCOUNT_STATUS } from "@/config/constants";
import { JoinRequest } from "@/models/JoinRequest";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import { Workshop } from "@/models/Workshop";
import { SemesterPlan } from "@/models/SemesterPlan";
import { requireAdmin } from "@/server/dal";
import { seedDatabase } from "@/server/seed";
import { revalidatePath } from "next/cache";

async function seedNow() {
  "use server";
  await requireAdmin();
  await seedDatabase();
  revalidatePath("/admin");
}

export default async function AdminHomePage() {
  const user = await requireAdmin();
  await connectDb();
  const [pending, members, events, workshops, plans, joins] = await Promise.all([
    User.countDocuments({ status: ACCOUNT_STATUS.PENDING }),
    User.countDocuments({ status: ACCOUNT_STATUS.APPROVED }),
    Event.countDocuments(),
    Workshop.countDocuments(),
    SemesterPlan.countDocuments(),
    JoinRequest.countDocuments({ status: "new" }),
  ]);

  return (
    <DashShell title="Dashboard" user={user}>
      <div className="dash-grid">
        <Link className="dash-stat" href="/admin/people">
          <strong>{pending}</strong>
          <span>Profiles waiting</span>
        </Link>
        <Link className="dash-stat" href="/admin/people">
          <strong>{members}</strong>
          <span>Approved staff</span>
        </Link>
        <Link className="dash-stat" href="/admin/join-requests">
          <strong>{joins}</strong>
          <span>Join letters</span>
        </Link>
        <Link className="dash-stat" href="/admin/events">
          <strong>{events}</strong>
          <span>Events</span>
        </Link>
        <Link className="dash-stat" href="/admin/workshops">
          <strong>{workshops}</strong>
          <span>Workshops</span>
        </Link>
        <Link className="dash-stat" href="/ec">
          <strong>{plans}</strong>
          <span>Semester plans</span>
        </Link>
      </div>
      <p className="body">
        Every public sentence, photograph, event, workshop, and tenure on the site is editable from this
        desk. Core and EC accounts appear under People until you approve them.
      </p>
      <form action={seedNow}>
        <button className="btn btn-outline" type="submit">
          Load starter copy into empty collections
        </button>
      </form>
    </DashShell>
  );
}
