import Link from "next/link";
import { logoutAction } from "@/server/actions/auth";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/site", label: "Site & CTA" },
  { href: "/admin/pages", label: "Page copy" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/writings", label: "Writings" },
  { href: "/admin/history", label: "History" },
  { href: "/admin/constitution", label: "Constitution" },
  { href: "/admin/workshops", label: "Workshops" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/join-requests", label: "Join inbox" },
  { href: "/ec", label: "Semester plan" },
];

export default function DashShell({ title, user, children, nav = "admin" }) {
  const items =
    nav === "ec"
      ? [
          { href: "/ec", label: "Semester plan" },
          { href: "/me/inbox", label: "Director inbox" },
          { href: "/me", label: "My profile" },
        ]
      : nav === "me"
        ? [
            { href: "/me", label: "Profile" },
            { href: "/me/memories", label: "Memories" },
            { href: "/me/portfolio", label: "Portfolio" },
            { href: "/me/inbox", label: "Invitations" },
          ]
        : links;

  return (
    <div className="dash">
      <aside className="dash-side">
        <Link href="/" className="dash-brand">
          CLS
        </Link>
        <p className="dash-user">
          {user?.name}
          <span>{user?.office || user?.role}</span>
        </p>
        <nav>
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button className="btn" type="submit">
            Sign out
          </button>
        </form>
      </aside>
      <section className="dash-main">
        <h1>{title}</h1>
        {children}
      </section>
    </div>
  );
}
