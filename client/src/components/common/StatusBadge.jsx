export default function StatusBadge({ status }) {
  const published = status === "published";
  return (
    <span className="badge" data-status={published ? "published" : "draft"}>
      {published ? "Published" : "Draft"}
    </span>
  );
}