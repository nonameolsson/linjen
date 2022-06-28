import { PlusIcon } from '@heroicons/react/outline'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { Page } from '~/components/page'
import { getTimelineListItems } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

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
        <Link to='/timeline/new' className='mb-4 btn btn-accent btn-gap-2'>
          <PlusIcon className='w-5 h-5' aria-hidden='true' />
          New Timeline
        </Link>

        {data.timelineListItems.length === 0 ? (
          <p className='p-4'>No timelines yet</p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {data.timelineListItems.map(timeline => (
              <Link to={`/timeline/${timeline.id}/events`} key={timeline.id}>
                <div
                  key={timeline.id}
                  className='shadow-lg hover:shadow-2xl hover:drop-shadow-2xl transition-shadow duration-150 ease-in-out card bg-base-100'
                >
                  <figure>
                    <img
                      src='https://api.lorem.space/image/shoes?w=400&h=225'
                      alt='Shoes'
                    />
                  </figure>
                  <div className='card-body'>
                    <h2 className='card-title'>{timeline.title}</h2>
                    <p>{timeline.description}</p>
                    <div className='justify-end card-actions'>
                      <div className='badge badge-outline'>
                        Events: {timeline._count.event}
                      </div>
                    </div>
                    <div className='justify-end card-actions'></div>
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
