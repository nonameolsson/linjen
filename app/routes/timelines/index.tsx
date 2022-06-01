import { Link } from "@remix-run/react";

export default function TimelineIndexPage() {
  return (
    <p>
      No timeline selected. Select a timeline on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new timeline.
      </Link>
    </p>
  );
}
