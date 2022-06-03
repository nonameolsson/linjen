import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Event } from "~/models/event.server";
import { deleteEvent, getEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  event: Event;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.eventId, "eventId not found");

  const event = await getEvent({ id: params.eventId });
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
    return json<LoaderData>({ event });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.eventId, "eventId not found");

  await deleteEvent({ userId, id: params.eventId });

  return redirect(`/timeline/${params.timelineId}/events`);
};

export default function EventDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="bg-white p-4">
      <h3 className="text-2xl font-bold">{data.event.title}</h3>
      <p className="py-6">{data.event.content}</p>
      <hr className="my-4" />
      <Form method="post">
        <input name="timelineId" hidden />
        <Link
          to="edit"
          className="rounded bg-orange-500  py-2 px-4 text-white hover:bg-orange-600 focus:bg-orange-400"
        >
          Edit
        </Link>
        <button
          type="submit"
          className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
        >
          Delete
        </button>
      </Form>
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
    return <div>Event not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
