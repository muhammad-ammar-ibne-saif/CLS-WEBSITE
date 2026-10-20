import Image from "next/image";

function isLocal(src) {
  return typeof src === "string" && src.startsWith("/") && !src.startsWith("//");
}

export default function SmartImage({
  src,
  alt = "",
  width,
  height,
  fill = false,
  sizes = "100vw",
  priority = false,
  className,
  style,
}) {
  if (!src) return null;
  const local = isLocal(src);
  const unoptimized = !local || /\.(svg|gif)$/i.test(src);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={className}
        style={style}
      />
    );
  }

  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={className}
        style={style}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      className={className}
      style={{ width: "100%", height: "auto", ...style }}
    />
  );
}
