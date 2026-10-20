import { isVideoUrl } from "@/lib/utils";

export default function MediaPreview({ url, className = "dash-preview" }) {
  if (!url) return null;
  if (isVideoUrl(url)) return <video src={url} className={className} controls preload="metadata" />;
  if (/\.pdf(\?.*)?$/i.test(url)) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="dash-hint">
        Open PDF
      </a>
    );
  }
  return <img src={url} alt="" className={className} loading="lazy" decoding="async" />;
}
