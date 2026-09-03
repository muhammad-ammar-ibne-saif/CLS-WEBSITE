import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import { connectDb } from "@/lib/db";
import { isDirector, toPlain } from "@/lib/utils";
import { Assignment } from "@/models/Assignment";
import { respondAsDirectorAction } from "@/server/actions/plans";
import { requireApproved } from "@/server/dal";

export const metadata = { title: "Director inbox" };

export default async function EcInboxPage() {
  const user = await requireApproved();
  await connectDb();
  const mine = (
    await Assignment.find({ user: user._id }).populate("plan").sort({ createdAt: -1 }).lean()
  ).map(toPlain);

  return (
    <DashShell title="Director inbox" user={user} nav="ec">
      {!isDirector(user) && user.role !== "admin" ? (
        <p className="body">This inbox is for department directors. Your EC calendar is still under Semester plan.</p>
      ) : null}
      <div className="dash-cards">
        {mine.map((row) => {
          const item = row.plan?.items?.find((entry) => String(entry._id) === String(row.itemId));
          return (
            <article className="dash-card" key={row._id}>
              <div>
                <h3>{item?.title || "Calendar item"}</h3>
                <p>
                  {row.plan?.title} · {item?.kind} · {row.status}
                </p>
                <p className="body">{item?.description}</p>
                <ActionForm action={respondAsDirectorAction} className="form dash-form-tight">
                  <input type="hidden" name="id" value={row._id} />
                  <label>
                    Response
                    <select name="status" defaultValue={row.status}>
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
                    Send response
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
