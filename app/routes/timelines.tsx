import { PlusIcon } from '@heroicons/react/outline'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { Page } from '~/components/page'
import { getTimelineListItems } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  timelineListItems: Awaited<ReturnType<typeof getTimelineListItems>>
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const timelineListItems = await getTimelineListItems({ userId })
  return json<LoaderData>({ timelineListItems })
}

export default function TimelinesPage() {
  const data = useLoaderData<LoaderData>()

  return (
    <Page title='Your Timelines'>
      <div className='h-full'>
        <Link
          to='/timeline/new'
          className='fixed right-4 bottom-4 shadow-2xl drop-shadow-2xl btn btn-primary btn-circle btn-xl'
        >
          <PlusIcon className='w-5 h-5' aria-hidden='true' />
        </Link>

        {data.timelineListItems.length === 0 ? (
          <p className='p-4'>No timelines yet</p>
        ) : (
          <div className='flex overflow-x-auto gap-6 px-16 pb-16 w-full h-min snap-x snap-mandatory'>
            {data.timelineListItems.map(timeline => (
              <Link
                to={`/timeline/${timeline.id}/events`}
                key={timeline.id}
                className='h-min snap-center snap-always'
              >
                <div
                  key={timeline.id}
                  className='w-60 shadow hover:shadow-xl hover:drop-shadow-xl transition-shadow duration-150 ease-in-out card bg-base-100'
                >
                  {timeline.imageUrl ? (
                    <figure>
                      <img
                        src={timeline.imageUrl}
                        className='aspect-video object-cover w-full'
                        alt='Shoes'
                      />
                    </figure>
                  ) : (
                    <span className='aspect-video flex object-cover justify-center items-center w-full text-4xl text-center bg-info text-info-content'>
                      {timeline.title.slice(0, 2)}
                    </span>
                  )}
                  <div className='card-body'>
                    <h2 className='card-title'>{timeline.title}</h2>
                    <p className='line-clamp-3'>{timeline.description}</p>
                    <div className='justify-end card-actions'>
                      <div className='badge badge-outline'>
                        Events: {timeline._count.event}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}
