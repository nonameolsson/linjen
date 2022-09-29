import {
  Badge,
  Card,
  createStyles,
  Group,
  Image,
  SimpleGrid,
  Text
} from '@mantine/core'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { IconPlus } from '@tabler/icons'

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

const useStyles = createStyles(theme => ({
  card: {
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',

    '&:hover': {
      boxShadow: theme.shadows.sm
    }
  }
}))

export default function TimelinesPage() {
  const { classes } = useStyles()
  const data = useLoaderData<LoaderData>()

  return (
    <Page
      title={pageTitle}
      fab={{ icon: <IconPlus />, offset: false, to: '/timeline/new' }}
    >
      {data.timelineListItems.length === 0 ? (
        <p>No timelines yet</p>
      ) : (
        <>
          <SimpleGrid
            breakpoints={[
              { minWidth: 'sm', cols: 2 },
              { minWidth: 'md', cols: 3 },
              { minWidth: 1200, cols: 4, spacing: 'xl' }
            ]}
          >
            {data.timelineListItems.map(timeline => (
              <Card
                className={classes.card}
                key={timeline.id}
                p='lg'
                radius='md'
                withBorder
                component={Link}
                to={`/timeline/${timeline.id}/events`}
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
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}
    </Page>
  )
}
