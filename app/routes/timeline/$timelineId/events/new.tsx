import type { Event } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition
} from '@remix-run/react'
import React from 'react'
import invariant from 'tiny-invariant'
import { TextArea, TextField } from '~/components'
import EventCard from '~/components/event-card'
import { createEvent, getEventsList } from '~/models/event.server'
import { requireUserId } from '~/session.server'

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

type LoaderData = {
  events: Pick<Event, 'id' | 'title'>[]
}

// TODO: Add Zod valiation on params
export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  const events = await getEventsList(params.timelineId)

  if (!events) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ events })
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireUserId(request)
  const formData = await request.formData()

  const title = formData.get('title')
  const content = formData.get('content')
  const startDate = formData.get('startDate')

  const timelineId = params.timelineId
  invariant(timelineId, 'Timeline ID is required')

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

  const fields = { title, content, startDate, timelineId }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  const event = await createEvent({
    data: {
      title,
      content,
      startDate: new Date(startDate)
    },
    timelineId
  })

  return redirect(`/timeline/${timelineId}/events/${event.id}`)
}

export default function NewEventPage() {
  const data = useLoaderData<LoaderData>()

  const actionData = useActionData<ActionData | undefined>()
  const transition = useTransition()

  const titleRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLTextAreaElement>(null)
  const startDateRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (actionData?.fieldErrors?.title) {
      titleRef.current?.focus()
    } else if (actionData?.fieldErrors?.content) {
      contentRef.current?.focus()
    } else if (actionData?.fieldErrors?.startDate) {
      startDateRef.current?.focus()
    }
  }, [actionData])

  if (transition.submission) {
    const title = transition.submission.formData.get('title')
    const content = transition.submission.formData.get('content')
    const startDate = transition.submission.formData.get('startDate')

    if (
      typeof title === 'string' &&
      typeof content === 'string' &&
      typeof startDate === 'string' &&
      !validateEventTitle(title) &&
      !validateEventContent(content) &&
      !validateEventStartDate(startDate)
    ) {
      return (
        <EventCard
          events={[]}
          locations={[]}
          content={content}
          startDate={new Date(startDate)}
          title={title}
        />
      )
    }
  }

  return (
    <Form
      method='post'
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%'
      }}
    >
      <TextField
        autoFocus
        ref={titleRef}
        label='Title'
        defaultValue={actionData?.fields?.title}
        name='title'
        errorMessage={actionData?.fieldErrors?.title}
      />

      <TextArea
        autoFocus
        ref={contentRef}
        label='Content'
        defaultValue={actionData?.fields?.content}
        name='content'
        rows={4}
        errorMessage={actionData?.fieldErrors?.content}
      />

      <TextField
        autoFocus
        type='date'
        ref={startDateRef}
        label='Start Date'
        defaultValue={
          actionData?.fields?.startDate ||
          new Intl.DateTimeFormat('sv-SE').format(new Date())
        }
        name='startDate'
        errorMessage={actionData?.fieldErrors?.startDate}
      />

      <div className='text-right'>
        <button type='submit' className='btn btn-primary'>
          Save
        </button>
      </div>
    </Form>
  )
}
