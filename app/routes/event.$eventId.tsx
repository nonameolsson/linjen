import { Grid, Menu, Paper, Text, Title } from '@mantine/core'
import { openConfirmModal, openContextModal } from '@mantine/modals'
import type { ExternalLink, Location, Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useCatch, useLoaderData, useSubmit } from '@remix-run/react'
import { IconEdit, IconTrash } from '@tabler/icons'
import invariant from 'tiny-invariant'
import { z } from 'zod'

import {
  linkFormSchema,
  LinkList,
  List,
  OverflowButton,
  Page
} from '~/components'
import { SidebarWidget } from '~/components/sidebar-widget'
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

export default function EventDetailsPage() {
  const data = useLoaderData<LoaderData>()
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

  return (
    <Page
      title={data.event.title}
      showBackButton
      padding={0}
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
        <>
          <SidebarWidget>
            <List
              title='Timelines'
              items={data.event.timelines.map(timeline => {
                return {
                  linkTo: timeline.id,
                  title: timeline.title,
                  id: timeline.id
                }
              })}
            />
          </SidebarWidget>

          <SidebarWidget>
            <List
              title='Events'
              items={referencedEvents.map(event => {
                return {
                  title: event.title,
                  linkTo: event.id,
                  description: event.content || undefined,
                  id: event.id
                }
              })}
            />
          </SidebarWidget>

          <SidebarWidget>
            <List
              title='Locations'
              items={data.event.location.map(location => {
                return {
                  linkTo: `location/${location.id}`,
                  title: location.title,
                  id: location.id
                }
              })}
            />
          </SidebarWidget>
        </>
      }
    >
      <Grid>
        <Grid.Col span={12} lg={12} p={0}>
          <Paper p='md'>
            <Title order={3}>Event Information</Title>
            <div>
              Start Date
              {new Intl.DateTimeFormat('sv-SE').format(
                new Date(data.event.startDate)
              )}
            </div>
            <div>
              Content
              {data.event.content}
            </div>
          </Paper>

          <LinkList
            onNewClick={openNewLinkModal}
            title='Links'
            items={data.event.externalLinks.map(link => ({
              title: link.title,
              url: link.url,
              id: link.id
            }))}
          />
        </Grid.Col>
      </Grid>
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
