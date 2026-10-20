import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import MediaField from "@/components/admin/MediaField";
import {
  ACCOUNT_STATUS,
  DEPARTMENTS,
  EC_RANK_LABELS,
  EC_RANK_ORDER,
  TEAMS,
} from "@/config/constants";
import { connectDb } from "@/lib/db";
import { ecRankOf, toPlain } from "@/lib/utils";
import { User } from "@/models/User";
import { reviewMemberAction } from "@/server/actions/people";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "People" };
export const dynamic = "force-dynamic";

function PersonForm({ person, pending }) {
  const team = person.team || TEAMS.CORE;
  return (
    <ActionForm action={reviewMemberAction} className="form dash-form-tight" successText="Saved.">
      <input type="hidden" name="id" value={person._id} />
      <MediaField library name="avatar" label="Portrait" defaultValue={person.avatar} />
      <label>
        Name
        <input name="name" defaultValue={person.name} required />
      </label>
      <label>
        Team
        <select name="team" defaultValue={team}>
          <option value={TEAMS.CORE}>Core</option>
          <option value={TEAMS.EC}>Executive Council</option>
        </select>
      </label>
      <label>
        EC position (Executive Council only)
        <select name="ecRank" defaultValue={team === TEAMS.EC ? ecRankOf(person) : ""}>
          <option value="">Not applicable</option>
          {EC_RANK_ORDER.map((rank) => (
            <option key={rank} value={rank}>
              {EC_RANK_LABELS[rank]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Title on the page
        <input name="office" defaultValue={person.office} placeholder="Urdu Director, Design Lead" />
      </label>
      <label>
        Department
        <select name="department" defaultValue={person.department || DEPARTMENTS[0]}>
          {DEPARTMENTS.map((dept) => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
      </label>
      <label>
        Order on the page (lower first)
        <input name="sortOrder" type="number" defaultValue={person.sortOrder || 0} />
      </label>
      <label className="dash-check">
        <input name="isDirector" type="checkbox" defaultChecked={person.isDirector} />
        Department director
      </label>
      <label className="dash-check">
        <input name="showOnLeadership" type="checkbox" defaultChecked={pending ? true : person.showOnLeadership} />
        Show on the Leadership page
      </label>
      <div className="dash-actions">
        {pending ? (
          <>
            <button className="btn" name="decision" value="approve" type="submit">
              Approve and publish
            </button>
            <button className="dash-mini" name="decision" value="reject" type="submit">
              Reject
            </button>
          </>
        ) : (
          <>
            <button className="btn" name="decision" value="update" type="submit">
              Update
            </button>
            {person.status === ACCOUNT_STATUS.APPROVED ? (
              <button className="dash-mini" name="decision" value="suspend" type="submit">
                Suspend
              </button>
            ) : (
              <button className="btn" name="decision" value="restore" type="submit">
                Restore
              </button>
            )}
          </>
        )}
        <ConfirmButton
          className="dash-mini"
          name="decision"
          value="remove"
          message={`Remove ${person.name} permanently?`}
        >
          Remove
        </ConfirmButton>
      </div>
    </ActionForm>
  );
}

function Card({ person, pending }) {
  return (
    <article className="dash-card" key={person._id}>
      <div>
        <h3>{person.name}</h3>
        <p>
          {person.email} · {person.team === TEAMS.EC ? "EC" : "Core"}
          {person.team === TEAMS.EC ? ` · ${EC_RANK_LABELS[ecRankOf(person)]}` : ""} · {person.status}
        </p>
        {person.headline ? <p className="body">{person.headline}</p> : null}
        <PersonForm person={person} pending={pending} />
      </div>
    </article>
  );
}

export default async function AdminPeoplePage() {
  const admin = await requireAdmin();
  await connectDb();
  const people = (
    await User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .lean()
  ).map(toPlain);
  const pending = people.filter((person) => person.status === ACCOUNT_STATUS.PENDING);
  const rest = people.filter((person) => person.status !== ACCOUNT_STATUS.PENDING);

  return (
    <DashShell title="Core & EC people" user={admin}>
      <h2 className="dash-h2">Waiting on approval ({pending.length})</h2>
      {pending.length === 0 ? <p className="body">No pending profiles.</p> : null}
      <div className="dash-cards">
        {pending.map((person) => (
          <Card key={person._id} person={person} pending />
        ))}
      </div>

      <h2 className="dash-h2">Everyone else ({rest.length})</h2>
      <div className="dash-cards">
        {rest.map((person) => (
          <Card key={person._id} person={person} />
        ))}
      </div>
    </DashShell>
  );
}
