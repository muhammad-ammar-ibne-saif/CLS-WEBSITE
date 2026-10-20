import SmartImage from "@/components/SmartImage";
import { isFrameAsset, isVideoUrl } from "@/lib/utils";

export default function Frame({
  src,
  alt = "",
  variant = "portrait",
  size = "card",
  sizes = "(max-width: 960px) 90vw, 360px",
  priority = false,
  poster,
  className = "",
  children,
}) {
  const hasMedia = !isFrameAsset(src);
  const video = hasMedia && isVideoUrl(src);
  const classes = [
    "frame",
    variant === "landscape" ? "frame-landscape" : "frame-portrait",
    size === "hero" ? "frame-hero" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="frame-art" aria-hidden="true" />
      <div className="frame-window">
        {video ? (
          <video
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label={alt || undefined}
          />
        ) : null}
        {hasMedia && !video ? (
          <SmartImage src={src} alt={alt} fill sizes={sizes} priority={priority} />
        ) : null}
      </div>
      {children ? <div className="frame-overlay">{children}</div> : null}
    </div>
  );
}
