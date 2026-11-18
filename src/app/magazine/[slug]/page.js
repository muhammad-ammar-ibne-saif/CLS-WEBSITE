import Link from "next/link";
import { notFound } from "next/navigation";
import ComingSoon from "@/components/ComingSoon";
import SiteShell from "@/components/SiteShell";
import MagazineReader from "@/components/magazine/MagazineReader";
import { getMagazine, isComingSoon } from "@/server/queries/public";

export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const issue = await getMagazine(slug);
  return {
    title: issue?.title ?? "Magazine",
    description: issue?.summary || undefined,
    openGraph: issue?.cover ? { images: [issue.cover] } : undefined,
  };
}

export default async function MagazineIssuePage({ params }) {
  if (await isComingSoon("magazine")) return <ComingSoon pageKey="magazine" />;
  const { slug } = await params;
  const issue = await getMagazine(slug);
  if (!issue) notFound();

  return (
    <SiteShell showJoin={false}>
      <section className="mag-read">
        <div className="mag-read-head">
          <Link className="mag-back" href="/magazine">
            ← All issues
          </Link>
          <p className="eyebrow">{issue.issue}</p>
          <h1 className="headline">{issue.title}</h1>
        </div>
        <MagazineReader src={issue.file} title={issue.title} />
      </section>
    </SiteShell>
  );
}
