import { PlusIcon } from '@heroicons/react/solid'
import { Alert, Badge, Card, Group, Image, Text } from '@mantine/core'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useCatch, useLoaderData } from '@remix-run/react'
import { Aside } from '~/components'
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

  return (
    <Page
      aside={<Aside>Aside timelines</Aside>}
      title={pageTitle}
      fab={{
        to: '/timeline/new',
        icon: <PlusIcon className='h-5 w-5' aria-hidden='true' />,
        offset: false
      }}
    >
      <section>
        {data.timelineListItems.length === 0 ? (
          <p>No timelines yet</p>
        ) : (
          <div>
            {data.timelineListItems.map(timeline => (
              <Link to={`/timeline/${timeline.id}/events`} key={timeline.id}>
                <Card shadow='sm' p='lg' radius='md' withBorder>
                  <Card.Section>
                    <Image
                      src={timeline.imageUrl || undefined}
                      height={160}
                      alt='Norway'
                    />
                  </Card.Section>

                  <Group position='apart' mt='md' mb='xs'>
                    <Text weight={500}>{timeline.title.slice(0, 2)}</Text>
                    <Badge color='pink' variant='light'>
                      Events: {timeline._count.event}
                    </Badge>
                    <Badge color='pink' variant='light'>
                      People: On Sale
                    </Badge>
                    <Badge color='pink' variant='light'>
                      Locations
                    </Badge>
                  </Group>

                  <Text size='sm' color='dimmed'>
                    {timeline.description}
                  </Text>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
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
            <Alert color='red'>{`${caught.status} ${caught.statusText}`}</Alert>
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
            <Alert color='red'>{error.message}</Alert>
          </section>
        </main>
      </div>
    </Page>
  )
}
