import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import { ACCOUNT_STATUS, DEPARTMENTS, TEAMS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { User } from "@/models/User";
import { reviewMemberAction } from "@/server/actions/people";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "People" };

export default async function AdminPeoplePage() {
  const admin = await requireAdmin();
  await connectDb();
  const people = (await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 }).lean()).map(toPlain);
  const pending = people.filter((person) => person.status === ACCOUNT_STATUS.PENDING);
  const rest = people.filter((person) => person.status !== ACCOUNT_STATUS.PENDING);

  return (
    <DashShell title="Core & EC people" user={admin}>
      <h2 className="dash-h2">Waiting on approval</h2>
      {pending.length === 0 ? <p className="body">No pending profiles.</p> : null}
      <div className="dash-cards">
        {pending.map((person) => (
          <article className="dash-card" key={person._id}>
            <img src={person.avatar || "/assets/portrait-frame.png"} alt="" />
            <div>
              <h3>{person.name}</h3>
              <p>
                {person.team} · {person.department} · {person.semester}
              </p>
              <p className="body">{person.headline}</p>
              <ActionForm action={reviewMemberAction} className="form dash-form-tight">
                <input type="hidden" name="id" value={person._id} />
                <label>
                  Team
                  <select name="team" defaultValue={person.team || TEAMS.CORE}>
                    <option value={TEAMS.CORE}>Core</option>
                    <option value={TEAMS.EC}>EC</option>
                  </select>
                </label>
                <label>
                  Office
                  <input name="office" defaultValue={person.office} placeholder="Urdu Director" />
                </label>
                <label>
                  Department
                  <select name="department" defaultValue={person.department}>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept}>{dept}</option>
                    ))}
                  </select>
                </label>
                <label className="dash-check">
                  <input name="isDirector" type="checkbox" defaultChecked={person.isDirector} />
                  Department director
                </label>
                <label className="dash-check">
                  <input name="showOnLeadership" type="checkbox" defaultChecked />
                  Show on leadership wall
                </label>
                <div className="dash-actions">
                  <button className="btn" name="decision" value="approve" type="submit">
                    Approve
                  </button>
                  <button className="dash-mini" name="decision" value="reject" type="submit">
                    Reject
                  </button>
                </div>
              </ActionForm>
            </div>
          </article>
        ))}
      </div>

      <h2 className="dash-h2">Approved</h2>
      <div className="dash-cards">
        {rest.map((person) => (
          <article className="dash-card" key={person._id}>
            <img src={person.avatar || "/assets/portrait-frame.png"} alt="" />
            <div>
              <h3>{person.name}</h3>
              <p>
                {person.status} · {person.team} · {person.office}
              </p>
              <ActionForm action={reviewMemberAction} className="form dash-form-tight">
                <input type="hidden" name="id" value={person._id} />
                <input type="hidden" name="decision" value="update" />
                <label>
                  Team
                  <select name="team" defaultValue={person.team || TEAMS.CORE}>
                    <option value={TEAMS.CORE}>Core</option>
                    <option value={TEAMS.EC}>EC</option>
                  </select>
                </label>
                <label>
                  Office
                  <input name="office" defaultValue={person.office} />
                </label>
                <label>
                  Department
                  <select name="department" defaultValue={person.department}>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept}>{dept}</option>
                    ))}
                  </select>
                </label>
                <label className="dash-check">
                  <input name="isDirector" type="checkbox" defaultChecked={person.isDirector} />
                  Director
                </label>
                <label className="dash-check">
                  <input name="showOnLeadership" type="checkbox" defaultChecked={person.showOnLeadership} />
                  On leadership page
                </label>
                <button className="btn" type="submit">
                  Update
                </button>
              </ActionForm>
            </div>
          </article>
        ))}
      </div>
    </DashShell>
  );
}
