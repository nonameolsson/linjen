import { PlusIcon } from '@heroicons/react/outline'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useCatch, useLoaderData } from '@remix-run/react'
import { PageHeader } from '~/components'
import { Alert } from '~/components/alert'
import { Content } from '~/components/content'
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

const pageTitle = 'Your Timelines'

export default function TimelinesPage() {
  const data = useLoaderData<LoaderData>()
  console.log(data.timelineListItems)

  return (
    <Page
      title={pageTitle}
      fab={{
        to: '/timeline/new',
        icon: <PlusIcon className='h-5 w-5' aria-hidden='true' />,
        offset: false
      }}
    >
      <Content desktopNavbar={<PageHeader hideBackButton title={pageTitle} />}>
        <section className='col-span-12 lg:col-span-8 lg:col-start-2'>
          {data.timelineListItems.length === 0 ? (
            <p className='p-4'>No timelines yet</p>
          ) : (
            <div className='flex h-min w-full snap-x snap-mandatory gap-6 overflow-x-auto px-16 pb-16'>
              {data.timelineListItems.map(timeline => (
                <Link
                  to={`/timeline/${timeline.id}/events`}
                  key={timeline.id}
                  className='h-min snap-center snap-always'
                >
                  <div
                    key={timeline.id}
                    className='card w-60 bg-base-100 shadow transition-shadow duration-150 ease-in-out hover:shadow-xl hover:drop-shadow-xl'
                  >
                    {timeline.imageUrl ? (
                      <figure>
                        <img
                          src={timeline.imageUrl}
                          className='aspect-video w-full object-cover'
                          alt='Shoes'
                        />
                      </figure>
                    ) : (
                      <span className='flex aspect-video w-full items-center justify-center bg-info object-cover text-center text-4xl text-info-content'>
                        {timeline.title.slice(0, 2)}
                      </span>
                    )}
                    <div className='card-body'>
                      <h2 className='card-title'>{timeline.title}</h2>
                      <p className='line-clamp-3'>{timeline.description}</p>
                      <div className='card-actions justify-end'>
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
        </section>
      </Content>
    </Page>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <Page title={`${caught.status} ${caught.statusText}`}>
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <h1>App Error</h1>
            <Alert text={`${caught.status} ${caught.statusText}`} />
          </section>
        </main>
      </div>
    </Page>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Page title='Uh-oh!'>
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <h1>App Error</h1>
            <Alert text={error.message} />
          </section>
        </main>
      </div>
    </Page>
  )
}
