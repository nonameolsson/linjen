import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MailIcon,
  PlusIcon,
} from "@heroicons/react/outline";

import { Fragment } from "react";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  LocationMarkerIcon,
  PencilIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

import type { Timeline } from "~/models/timeline.server";
import { deleteTimeline } from "~/models/timeline.server";
import { getTimeline } from "~/models/timeline.server";
import type { Event } from "~/models/event.server";
import { getEventListItems } from "~/models/event.server";
import { requireUserId } from "~/session.server";

const tabs = [
  { name: "Details", href: "#", current: true },
  { name: "Events", href: "#", current: false },
  { name: "People", href: "#", current: false },
  { name: "Places", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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
      <div>
        <div>
          <nav className="sm:hidden" aria-label="Back">
            <Link
              to="/timelines"
              className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-200"
            >
              <ChevronLeftIcon
                className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-500"
                aria-hidden="true"
              />
              Back
            </Link>
          </nav>
        </div>
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1 flex-col">
            <Link
              to="/timelines"
              className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-200"
            >
              <ChevronLeftIcon
                className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-500"
                aria-hidden="true"
              />
              Back
            </Link>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {data.timeline.title}
            </h3>{" "}
            <p className="mt-1 text-sm text-gray-500">
              {data.timeline.description}
            </p>
          </div>
          <div className="mt-4 flex flex-shrink-0 md:mt-0 md:ml-4">
            <Form method="post">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Delete
              </button>
            </Form>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Edit
            </button>
          </div>
        </div>
      </div>


      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav
            className="relative z-0 flex divide-x divide-gray-200 rounded-lg shadow"
            aria-label="Tabs"
          >
            {tabs.map((tab, tabIdx) => (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={classNames(
                  tab.current
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700",
                  tabIdx === 0 ? "rounded-l-lg" : "",
                  tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                  "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    tab.current ? "bg-indigo-500" : "bg-transparent",
                    "absolute inset-x-0 bottom-0 h-0.5"
                  )}
                />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <hr className="my-4" />

      <h3 className="mb-4 text-2xl font-bold">Events</h3>
      <Link
        to="new"
        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
        Add Event
      </Link>
      {data.events.length > 0 ? (
        <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {data.events.map((event) => (
              <li key={event.title}>
                <a href={event.id} className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <p className="truncate text-sm font-medium text-indigo-600">
                            {event.title}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <MailIcon
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="truncate">
                              {event.startDate}
                              {event.endDate}
                            </span>
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <div>
                            <p className="text-sm text-gray-900">
                              Applied on{" "}
                              <time dateTime={event.startDate}>
                                {event.startDate}
                              </time>
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              <CheckCircleIcon
                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                                aria-hidden="true"
                              />
                              {event.userId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No events</p>
      )}
      {/* <Outlet /> */}
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
