import type { Event } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import invariant from 'tiny-invariant'
import { z } from 'zod'

import { Page, PageHeader, TextArea, TextField } from '~/components'
import { Content } from '~/components/content'
import {
  getEvent,
  getEventListForTimeline,
  updateEvent
} from '~/models/event.server'
import { requireUserId } from '~/session.server'
import { badRequestWithError } from '~/utils/index'

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' }), // TODO: Add translation
  content: z.string().optional(),
  startDate: z.preprocess(arg => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
  }, z.date())
})
type FormSchema = z.infer<typeof formSchema> // Infer the schema from Zod

type ActionData = {
  formPayload?: FormSchema
  error?: any
}

type LoaderData = {
  event: Event
  availableEvents: Pick<Event, 'id' | 'title'>[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)

  invariant(params.eventId, 'eventId not found')

  const event = await getEvent(params.eventId)
  const availableEvents = await getEventListForTimeline(params.eventId)

  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ event, availableEvents })
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireUserId(request)
  const formPayload = Object.fromEntries(await request.formData())

  const eventId = params.eventId
  invariant(eventId, 'Event ID is required')

  try {
    const result = formSchema.parse(formPayload)

    const { title, startDate, content } = result

    await updateEvent(
      { content, startDate: new Date(startDate), title },
      eventId
    )

    return redirect(`/event/${params.eventId}`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return badRequestWithError({
        error,
        formPayload,
        status: 400
      })
    }
    throw json(error, { status: 400 }) // Unknown error, should not happen
  }
}

export default function EditEvent() {
  const loaderData = useLoaderData<LoaderData>()

  const actionData = useActionData() as ActionData
  const titleRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLTextAreaElement>(null)
  const startDateRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (actionData?.error?.title) {
      titleRef.current?.focus()
    } else if (actionData?.error?.content) {
      contentRef.current?.focus()
    } else if (actionData?.error?.startDate) {
      startDateRef.current?.focus()
    }
  }, [actionData])

  return (
    <Page
      title='Edit event'
      showBackButton
      toolbarButtons={
        <button
          form='edit-event'
          className='btn btn-ghost'
          type='submit'
          name='action'
          value='update'
        >
          Save
        </button>
      }
    >
      <Content
        title='Edit event'
        desktopNavbar={
          <PageHeader
            title='Edit event'
            actions={
              <>
                <button
                  form='edit-event'
                  className='btn btn-primary'
                  type='submit'
                  name='action'
                  value='update'
                >
                  Save
                </button>
              </>
            }
          />
        }
      >
        <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
          <Form
            replace
            method='post'
            id='edit-event'
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              width: '100%'
            }}
          >
            <TextField
              defaultValue={loaderData.event.title}
              label='Title'
              ref={titleRef}
              name='title'
              errorMessage={actionData?.error?.title?._errors[0]}
            />

            <TextArea
              label='Content'
              defaultValue={loaderData.event.content || ''}
              ref={contentRef}
              name='content'
              rows={4}
              errorMessage={actionData?.error?.content?._errors[0]}
            />

            <TextField
              label='Start Date'
              ref={startDateRef}
              type='date'
              defaultValue={new Intl.DateTimeFormat('sv-SV').format(
                new Date(loaderData.event.startDate)
              )}
              name='startDate'
              errorMessage={actionData?.error?.startDate?._errors[0]}
            />
          </Form>
        </section>
      </Content>
    </Page>
  )
}
