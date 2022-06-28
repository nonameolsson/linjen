import type { Event } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import invariant from 'tiny-invariant'
import { Page, TextArea, TextField } from '~/components'
import {
  getEvent,
  getEventListForTimeline,
  updateEvent
} from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  event: Event
  availableEvents: Pick<Event, 'id' | 'title'>[]
}

function validateEventTitle(title: string) {
  if (title.length === 0) {
    return 'You must add a title'
  }
}

function validateEventContent(content: string) {
  if (typeof content !== 'string') {
    return 'Content must be a string'
  }
}

function validateEventStartDate(startDate: string) {
  if (startDate.length === 0) {
    return 'You must select a start date'
  }
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

type ActionData = {
  formError?: string
  fieldErrors?: {
    title: string | undefined
    content: string | undefined
    startDate: string | undefined
  }
  fields?: {
    title: string
    content: string
    startDate: string
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request, params }) => {
  await requireUserId(request)
  const formData = await request.formData()

  const eventId = params.eventId
  invariant(eventId, 'Event ID is required')

  const title = formData.get('title')
  const content = formData.get('content')
  const startDate = formData.get('startDate')

  if (
    typeof title !== 'string' ||
    typeof content !== 'string' ||
    typeof startDate !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`
    })
  }

  const fieldErrors = {
    title: validateEventTitle(title),
    content: validateEventContent(content),
    startDate: validateEventStartDate(startDate)
  }

  const fields = { title, content, startDate }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  await updateEvent({ content, startDate: new Date(startDate), title }, eventId)

  return redirect(`/event/${params.eventId}`)
}

export default function EditEvent() {
  const data = useLoaderData<LoaderData>()

  const actionData = useActionData() as ActionData
  const titleRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLTextAreaElement>(null)
  const startDateRef = React.useRef<HTMLInputElement>(null)

  return (
    <Page title='Edit event' showBackButton>
      <Form
        replace
        method='post'
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: '100%'
        }}
      >
        <TextField
          defaultValue={data.event.title}
          label='Title'
          ref={titleRef}
          name='title'
          errorMessage={actionData?.fieldErrors?.title}
        />

        <TextArea
          label='Content'
          defaultValue={data.event.content || ''}
          ref={contentRef}
          name='content'
          rows={4}
          errorMessage={actionData?.fieldErrors?.content}
        />

        <TextField
          label='Start Date'
          ref={startDateRef}
          type='date'
          defaultValue={new Intl.DateTimeFormat('sv-SV').format(
            new Date(data.event.startDate)
          )}
          name='startDate'
          errorMessage={actionData?.fieldErrors?.startDate}
        />

        <div className='flex justify-between'>
          <button className='btn btn-error' type='submit'>
            Delete
          </button>
          <button className='btn btn-primary' type='submit'>
            Save
          </button>
        </div>
      </Form>
    </Page>
  )
}
