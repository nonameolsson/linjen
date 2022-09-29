import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  SimpleGrid,
  Text
} from '@mantine/core'
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

const pageTitle = 'Your Timelines'

export default function TimelinesPage() {
  const data = useLoaderData<LoaderData>()

  return (
    <Page title={pageTitle}>
      <section>
        {data.timelineListItems.length === 0 ? (
          <p>No timelines yet</p>
        ) : (
          <>
            <div>
              <Button component={Link} to={'/timeline/new'}>
                Create
              </Button>
            </div>
            <SimpleGrid cols={4}>
              {data.timelineListItems.map(timeline => (
                <Card
                  key={timeline.id}
                  shadow='sm'
                  p='lg'
                  radius='md'
                  withBorder
                >
                  <Card.Section>
                    <Image
                      src={
                        timeline.imageUrl ||
                        'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80'
                      }
                      height={160}
                      alt='Norway'
                    />
                  </Card.Section>

                  <Group position='apart' mt='md' mb='xs'>
                    <Text weight={500}>{timeline.title}</Text>
                    <Badge color='pink' variant='light'>
                      Events: {timeline._count.event}
                    </Badge>
                  </Group>

                  <Text size='sm' color='dimmed'>
                    {timeline.description}
                  </Text>

                  <Button
                    component={Link}
                    to={`/timeline/${timeline.id}/events`}
                    variant='light'
                    color='blue'
                    fullWidth
                    mt='md'
                    radius='md'
                  >
                    Open Timeline
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
          </>
        )}
      </section>
    </Page>
  )
}
