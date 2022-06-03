import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { Event } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { Page } from "~/components/page";
import { XIcon, TrashIcon, PencilIcon } from "@heroicons/react/outline";

import type { Timeline } from "~/models/timeline.server";
import { deleteTimeline } from "~/models/timeline.server";
import { getTimeline } from "~/models/timeline.server";

import { requireUserId } from "~/session.server";

type LoaderData = {
  timeline: Timeline;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.timelineId, "timelineId not found");

  const timeline = await getTimeline({ userId, id: params.timelineId });
  if (!timeline) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ timeline });
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
    <Page
      description={data.timeline.description}
      title={data.timeline.title}
      actions={
        <>
          <Link
            to="/timelines"
            className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <XIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Close
          </Link>
          <Form method="post">
            <button
              type="submit"
              className="ml-3 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Delete
            </button>
          </Form>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-orange-800"
          >
            <PencilIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Edit
          </button>
        </>
      }
    >
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue="events"
          >
            <option>Events</option>
            <option>People</option>
            <option>Places</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <NavLink
                to="events"
                className={({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  }`
                }
              >
                Events
              </NavLink>
              <NavLink
                to="places"
                className={({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  }`
                }
              >
                Places
              </NavLink>
              <NavLink
                to="people"
                className={({ isActive }) =>
                  `flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    isActive
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  }`
                }
              >
                People
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      <Outlet />
    </Page>
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
