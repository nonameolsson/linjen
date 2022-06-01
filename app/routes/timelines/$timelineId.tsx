import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Timeline } from "~/models/timeline.server";
import { deleteTimeline } from "~/models/timeline.server";
import { getTimeline } from "~/models/timeline.server";
import type { Event } from "~/models/event.server";
import { getEventListItems } from "~/models/event.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  timeline: Timeline;
  events: Event[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.timelineId, "timelineId not found");

  const timeline = await getTimeline({ userId, id: params.timelineId });
  if (!timeline) {
    throw new Response("Not Found", { status: 404 });
  }

  const events = await getEventListItems({ timelineId: timeline.id });

  return json<LoaderData>({ timeline, events });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.timelineId, "timelineId not found");

  await deleteTimeline({ userId, id: params.timelineId });

  return redirect("/timelines");
};

export default function TimelineDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.timeline.title}</h3>
      <p className="py-6">{data.timeline.description}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
      <h3 className="text-2xl font-bold">Events</h3>
      <ul>
        {data.events.length > 0 ? (
          data.events.map((event) => (
            <li key={event.id}>
              <Link to={`/timelines/${data.timeline.id}/${event.id}`}>{event.title}</Link>
            </li>
          ))
        ) : (
          <li>No events</li>
        )}
        <Link
          to="new"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          + New Event
        </Link>
      </ul>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Timeline not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
