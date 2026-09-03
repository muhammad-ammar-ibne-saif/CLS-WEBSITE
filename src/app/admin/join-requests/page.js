import DashShell from "@/components/admin/DashShell";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { JoinRequest } from "@/models/JoinRequest";
import { archiveJoinRequestAction } from "@/server/actions/people";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Join inbox" };

export default async function JoinRequestsPage() {
  const user = await requireAdmin();
  await connectDb();
  const rows = (await JoinRequest.find().sort({ createdAt: -1 }).lean()).map(toPlain);

  return (
    <DashShell title="Society join letters" user={user}>
      <div className="dash-list">
        {rows.map((row) => (
          <article className="dash-item" key={row._id}>
            <strong>{row.name}</strong>
            <span>
              {row.email} · {row.department} · {row.rollNumber}
            </span>
            <p className="body">{row.why}</p>
            <form action={archiveJoinRequestAction}>
              <input type="hidden" name="id" value={row._id} />
              <input type="hidden" name="status" value="archived" />
              <button className="dash-mini" type="submit">
                Archive
              </button>
            </form>
          </article>
        ))}
      </div>
    </DashShell>
  );
}
