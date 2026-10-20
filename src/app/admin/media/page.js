import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import CopyButton from "@/components/admin/CopyButton";
import DeleteMediaButton from "@/components/admin/DeleteMediaButton";
import MediaPreview from "@/components/admin/MediaPreview";
import MediaUploader from "@/components/admin/MediaUploader";
import { countMedia, listMedia } from "@/lib/storage";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Media library" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 36;

function size(bytes) {
  if (!bytes) return "0 KB";
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function AdminMediaPage({ searchParams }) {
  const user = await requireAdmin();
  const params = await searchParams;
  const kind = ["image", "video"].includes(params.kind) ? params.kind : "";
  const page = Math.max(1, Number(params.page) || 1);
  const [items, total] = await Promise.all([
    listMedia({ skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE, kind }),
    countMedia(),
  ]);
  const query = (next) => {
    const search = new URLSearchParams();
    if (kind) search.set("kind", kind);
    Object.entries(next).forEach(([key, value]) => value && search.set(key, String(value)));
    const text = search.toString();
    return `/admin/media${text ? `?${text}` : ""}`;
  };

  return (
    <DashShell title="Media library" user={user}>
      <MediaUploader />
      <div className="media-tools">
        <Link className="btn" href="/admin/media">
          All ({total})
        </Link>
        <Link className="btn" href="/admin/media?kind=image">
          Images
        </Link>
        <Link className="btn" href="/admin/media?kind=video">
          Videos
        </Link>
      </div>
      {items.length === 0 ? <p className="body">Nothing here yet. Upload your first file above.</p> : null}
      <div className="media-lib">
        {items.map((item) => (
          <article className="media-tile" key={item.id}>
            <div className="media-thumb">
              <MediaPreview url={item.url} className="" />
            </div>
            <strong>{item.filename}</strong>
            <small>
              {item.contentType} · {size(item.length)}
            </small>
            <code>{item.url}</code>
            <div className="dash-actions">
              <CopyButton text={item.url} />
              <DeleteMediaButton id={item.id} />
            </div>
          </article>
        ))}
      </div>
      <div className="media-pager">
        {page > 1 ? (
          <Link className="btn" href={query({ page: page - 1 })}>
            Newer
          </Link>
        ) : null}
        {items.length === PAGE_SIZE ? (
          <Link className="btn" href={query({ page: page + 1 })}>
            Older
          </Link>
        ) : null}
      </div>
    </DashShell>
  );
}
