import { Carousel } from '@mantine/carousel'
import {
  Button,
  Center,
  createStyles,
  Paper,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { IconPlus } from '@tabler/icons'

import { Page } from '~/components/page'
import { getTimelineListItems } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  timelineListItems: Awaited<ReturnType<typeof getTimelineListItems>>
}

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request)
  const timelineListItems = await getTimelineListItems({ userId })

  return json<LoaderData>({ timelineListItems })
}

const pageTitle = 'Your Timelines'

const useStyles = createStyles(theme => ({
  card: {
    height: 440,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: 32,
    marginTop: theme.spacing.xs
  },

  category: {
    color: theme.white,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase'
  }
}))

type CardProps = {
  events: number
  link: string
  title: string
  description: null | string
  imageUrl: null | string
}

function Card({ imageUrl, events, title, link }: CardProps) {
  const { classes } = useStyles()
  const image =
    imageUrl ||
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'

  return (
    <Paper
      shadow='md'
      p='xl'
      radius='md'
      sx={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size='xs'>
          Events: {events}
        </Text>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
      <Button variant='white' color='dark' component={Link} to={link}>
        Open Timeline
      </Button>
    </Paper>
  )
}

export default function TimelinesPage() {
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const data = useLoaderData<typeof loader>()

  const slides = data.timelineListItems.map(item => (
    <Carousel.Slide key={item.title}>
      <Card
        description={item.description}
        title={item.title}
        events={item._count.event}
        imageUrl={item.imageUrl}
        link={`/timeline/${item.id}/events`}
      />
    </Carousel.Slide>
  ))

  return (
    <Page
      title={pageTitle}
      fab={{ icon: <IconPlus />, offset: false, to: '/timeline/new' }}
    >
      <Center
        style={{
          height: '100%'
        }}
      >
        {data.timelineListItems.length === 0 ? (
          <p>It is empty here. Lets create timeline!</p>
        ) : (
          <Carousel
            slideSize='80%'
            breakpoints={[{ minWidth: 'lg', slideSize: '30%', slideGap: 'xl' }]}
            slideGap='md'
            skipSnaps={true}
            align='center'
            slidesToScroll={1}
            height='100%'
            withControls={!mobile}
            styles={{
              control: {
                '&[data-inactive]': {
                  opacity: 0,
                  cursor: 'default'
                }
              }
            }}
          >
            {slides}
          </Carousel>
        )}
      </Center>
    </Page>
  )
}
