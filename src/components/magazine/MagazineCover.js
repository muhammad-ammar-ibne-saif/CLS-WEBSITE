import SmartImage from "@/components/SmartImage";
import PdfThumb from "./PdfThumb";

// Cover image if the admin uploaded one, otherwise the PDF's first page.
export default function MagazineCover({ issue, priority = false }) {
  return (
    <div className="mag-cover">
      {issue.cover ? (
        <SmartImage
          src={issue.cover}
          alt={`${issue.title} cover`}
          fill
          sizes="(max-width: 700px) 70vw, 320px"
          priority={priority}
        />
      ) : (
        <PdfThumb src={issue.file} title={issue.title} />
      )}
    </div>
  );
}
