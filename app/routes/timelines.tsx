import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PlusIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { Page } from "~/components/page";
import { requireUserId } from "~/session.server";
import { getTimelineListItems } from "~/models/timeline.server";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type LoaderData = {
  timelineListItems: Awaited<ReturnType<typeof getTimelineListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const timelineListItems = await getTimelineListItems({ userId });
  return json<LoaderData>({ timelineListItems });
};

export default function TimelinesPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <Page title="Your Timelines">
      <Link
        to="/timelines/new"
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        New Timeline
      </Link>

      {data.timelineListItems.length === 0 ? (
        <p className="p-4">No timelines yet</p>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {data.timelineListItems.map((timeline) => (
            <Link
              key={timeline.title}
              to={`/timeline/${timeline.id}/events`}
              className="font-medium text-gray-900 hover:text-gray-600"
            >
              <li className="col-span-1 flex rounded-md shadow-sm">
                <div
                  className={classNames(
                    // timeline.bgColor,
                    "bg-pink-600",
                    "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                  )}
                >
                  {timeline.title.slice(0, 2)}
                </div>
                <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                    {timeline.title}

                    <p className="text-gray-500">{timeline._count.Event} events</p>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </Page>
  );
}
