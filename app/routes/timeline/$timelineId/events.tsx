import {
  CheckCircleIcon,
  ChevronRightIcon,
  MailIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getEventListItems } from "~/models/event.server";
import { requireUserId } from "~/session.server";
import type { Event } from "~/models/event.server";

type LoaderData = {
  events: Event[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.timelineId, "timelineId not found");

  const events = await getEventListItems({ timelineId: params.timelineId });

  return json<LoaderData>({ events });
};

export default function EventsTab() {
  const data = useLoaderData() as LoaderData;

  return (
    <>
      <div className="flex flex-1 items-stretch overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          {/* Primary column */}
          <section className="flex h-full min-w-0 flex-1 flex-col lg:order-last">
            <div className="flex justify-between">
              <Link
                to="new"
                className="flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                Add Event
              </Link>
            </div>
            {data.events.length > 0 ? (
              <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {data.events.map((event) => (
                    <li key={event.title}>
                      <Link to={event.id} className="block hover:bg-gray-50">
                        <div className="flex items-center px-4 py-4 sm:px-6">
                          <div className="flex min-w-0 flex-1 items-center">
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                              <div>
                                <p className="truncate text-sm font-medium text-indigo-600">
                                  {event.title}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500">
                                  <span className="truncate">
                                    {event.startDate}
                                  </span>
                                </p>
                              </div>
                              <div className="hidden md:block">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    {event.content}
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
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No events</p>
            )}
          </section>
        </main>

        {/* Secondary column (hidden on smaller screens) */}
        <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 p-4 lg:block">
          <Outlet />
        </aside>
      </div>
    </>
  );
}
