import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Menu,
  NavLink,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { openConfirmModal, openContextModal } from '@mantine/modals'
import type { ExternalLink, Location, Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useCatch, useLoaderData, useSubmit } from '@remix-run/react'
import {
  IconCalendarEvent,
  IconChevronRight,
  IconEdit,
  IconMap,
  IconTimeline,
  IconTrash
} from '@tabler/icons'
import invariant from 'tiny-invariant'
import { z } from 'zod'

import {
  ContentPaper,
  linkFormSchema,
  LinkList,
  OverflowButton,
  Page
} from '~/components'
import type { Event } from '~/models/event.server'
import { deleteEvent, getEvent } from '~/models/event.server'
import { createLink } from '~/models/externalLink'
import { requireUserId } from '~/session.server'
import { badRequestWithError } from '~/utils/index'

type LoaderData = {
  redirectTo?: string
  event: Event & {
    referencedBy: Event[]
    referencing: Event[]
    location: Location[]
    externalLinks: ExternalLink[]
    timelines: {
      id: Timeline['id']
      title: Timeline['title']
    }[]
  }
}

const DEFAULT_REDIRECT = 'timelines' // FIXME: Redirect back in history after deleting a newly created event.

// TODO: Add Zod valiation on params
export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)

  invariant(params.eventId, 'eventId not found')

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('from') || undefined

  const event = await getEvent(params.eventId)
  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ event, redirectTo })
}

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.eventId, 'eventId not found')
  await requireUserId(request)

  const formData = await request.formData()
  let action = formData.get('action')

  switch (action) {
    case '_add-link': {
      try {
        const result = linkFormSchema.parse(Object.fromEntries(formData))
        const { title, url } = result

        await createLink({ data: { title, url }, eventId: params.eventId })
        return json({ ok: true })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return badRequestWithError({
            error,
            formPayload: Object.fromEntries(formData),
            status: 400
          })
        }
        throw json(error, { status: 400 }) // Unknown error, should not happen
      }
    }

    case '_delete-event': {
      try {
        await deleteEvent(params.eventId)

        let redirectTo: string | undefined = DEFAULT_REDIRECT
        const optionalRedirect: string | undefined = formData
          .get('redirectTo')
          ?.toString()

        if (
          typeof optionalRedirect === 'string' &&
          optionalRedirect.length > 0
        ) {
          redirectTo = optionalRedirect
        }

        return redirect(redirectTo)
      } catch (error) {
        throw json(error, { status: 400 }) // Unknown error, should not happen
      }
    }
    default: {
      throw new Error('Unexpected action')
    }
  }
}

const PRIMARY_COL_HEIGHT = 300

function AsideWidget(props: {
  title: string
  icon?: JSX.Element
  emptyDataTitle: string
  data: { title: string; id: string }[]
  path: {
    prefix: string
    suffix?: string
  }
}): JSX.Element {
  const { data, emptyDataTitle, icon, path, title } = props

  return (
    <Box mb='xl'>
      <Group mb='md' mx='md'>
        {icon}
        <Title order={4}>{title}</Title>
      </Group>
      {data.length > 0 ? (
        data.map(item => (
          <NavLink
            styles={theme => ({
              root: {
                paddingLeft: theme.spacing.md,
                paddingRight: theme.spacing.md
              }
            })}
            component={Link}
            to={`/${path.prefix}/${item.id}/${path.suffix}`}
            label={item.title}
            key={item.id}
            rightSection={<IconChevronRight size={12} stroke={1.5} />}
          />
        ))
      ) : (
        <NavLink
          styles={theme => ({
            root: {
              paddingLeft: theme.spacing.md,
              paddingRight: theme.spacing.md
            }
          })}
          label={emptyDataTitle}
        />
      )}
    </Box>
  )
}

function EventAside(props: {
  timelines: { title: string; id: string }[]
  events: { title: string; id: string }[]
  locations: { title: string; id: string }[]
  people: { title: string; id: string }[]
}): JSX.Element {
  const { timelines, events, locations, people } = props
  const theme = useMantineTheme()

  return (
    <>
      <Box
        sx={{
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          borderBottom: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[7]
              : theme.colors.gray[3]
          }`,
          marginBottom: theme.spacing.xl,
          padding: theme.spacing.md,
          paddingTop: 18,
          height: 60
        }}
      >
        <Title order={3}>Related info</Title>
      </Box>
      <AsideWidget
        icon={<IconTimeline />}
        emptyDataTitle='No timelines'
        title='Timelines'
        data={timelines}
        path={{
          prefix: 'timeline',
          suffix: 'events'
        }}
      />

      <AsideWidget
        icon={<IconCalendarEvent />}
        emptyDataTitle='No events'
        title='Events'
        data={events}
        path={{
          prefix: '/event'
        }}
      />

      <AsideWidget
        icon={<IconMap />}
        emptyDataTitle='No locations'
        title='Locations'
        data={locations}
        path={{
          prefix: '/location'
        }}
      />
    </>
  )
}

export default function EventDetailsPage() {
  const data = useLoaderData<LoaderData>()
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const submit = useSubmit()

  function openNewLinkModal() {
    openContextModal({
      modal: 'newLink',
      title: 'New Link',
      innerProps: {
        eventId: data.event.id
      }
    })
  }

  function openDeleteModal() {
    openConfirmModal({
      title: 'Delete event',
      children: <Text size='sm'>Do you really want to delete this event?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => undefined,
      onConfirm: () =>
        submit(
          { redirectTo: data.redirectTo || '', action: '_delete-event' },
          { method: 'post', action: `event/${data.event.id}`, replace: true }
        )
    })
  }

  const referencedEvents = [
    ...data.event.referencedBy,
    ...data.event.referencing
  ]

  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2

  return (
    <Page
      showBackButton
      padding={0}
      title={data.event.title}
      toolbarButtons={
        <Menu shadow='md' width={200} position='bottom-end'>
          <Menu.Target>
            <OverflowButton />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconEdit size={14} />} component={Link} to='edit'>
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={openDeleteModal}
              color='red'
              icon={<IconTrash size={14} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
      aside={
        <EventAside
          events={referencedEvents}
          timelines={data.event.timelines}
          people={[]}
          locations={data.event.location}
        />
      }
    >
      <Container my='md'>
        <SimpleGrid
          cols={2}
          spacing='md'
          breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        >
          <Stack>
            <ContentPaper
              title={!isMobile ? data.event.title : undefined}
              description={new Intl.DateTimeFormat('sv-SE').format(
                new Date(data.event.startDate)
              )}
            >
              <Text>{data.event.content}</Text>
            </ContentPaper>
          </Stack>

          <Stack>
            <ContentPaper
              p={0}
              title='Links'
              styles={{
                content: { paddingTop: 0 },
                container: { padding: 0 }
              }}
              button={
                <Button
                  onClick={openNewLinkModal}
                  variant='filled'
                  size='md'
                  compact
                >
                  New
                </Button>
              }
            >
              <LinkList
                items={data.event.externalLinks.map(link => ({
                  title: link.title,
                  url: link.url,
                  id: link.id
                }))}
              />
            </ContentPaper>

            <Title order={3}>Gallery</Title>
            <Grid gutter='md'>
              <Grid.Col span={6}>
                <Skeleton
                  height={SECONDARY_COL_HEIGHT}
                  radius='md'
                  animate={false}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Skeleton
                  height={SECONDARY_COL_HEIGHT}
                  radius='md'
                  animate={false}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </SimpleGrid>
      </Container>
    </Page>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Event not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
