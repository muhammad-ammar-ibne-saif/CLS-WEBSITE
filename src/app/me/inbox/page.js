import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { Assignment } from "@/models/Assignment";
import { respondAsDirectorAction } from "@/server/actions/plans";
import { requireStaff } from "@/server/dal";

export const metadata = { title: "Inbox" };

export default async function MeInboxPage() {
  const user = await requireStaff();
  await connectDb();
  const mine = (
    await Assignment.find({ user: user._id }).populate("plan").sort({ createdAt: -1 }).lean()
  ).map(toPlain);

  return (
    <DashShell title="Calendar invitations" user={user} nav="me">
      <p className="body">When EC publishes a semester plan that names your department, it lands here — and in email.</p>
      <div className="dash-cards">
        {mine.map((row) => {
          const item = row.plan?.items?.find((entry) => String(entry._id) === String(row.itemId));
          return (
            <article className="dash-card" key={row._id}>
              <div>
                <h3>{item?.title || "Item"}</h3>
                <p>
                  {row.plan?.title} · {row.status}
                </p>
                <p className="body">{item?.description}</p>
                <ActionForm action={respondAsDirectorAction} className="form dash-form-tight">
                  <input type="hidden" name="id" value={row._id} />
                  <label>
                    Response
                    <select name="status" defaultValue={row.status === "pending" ? "accepted" : row.status}>
                      <option value="accepted">Accept</option>
                      <option value="maybe">Maybe</option>
                      <option value="declined">Decline</option>
                    </select>
                  </label>
                  <label>
                    Note
                    <textarea name="note" defaultValue={row.note} />
                  </label>
                  <button className="btn" type="submit">
                    Respond
                  </button>
                </ActionForm>
              </div>
            </article>
          );
        })}
      </div>
    </DashShell>
  );
}
