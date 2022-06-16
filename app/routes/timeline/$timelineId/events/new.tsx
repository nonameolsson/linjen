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
    relatedEvents: string | undefined
  }
  fields?: {
    title: string
    content: string
    startDate: string
    relatedEvents: number[]
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

  const events = await getEventsList({ timelineId: params.timelineId })

  if (!events) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ events })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()

  const title = formData.get('title')
  const content = formData.get('content')
  const startDate = formData.get('startDate')
  const relatedEvents = formData.get('relatedEvents')
  console.log('relatedEvents')
  console.log(relatedEvents)
  const timelineId = params.timelineId
  invariant(timelineId, 'Timeline ID is required')
  console.log(formData)
  if (
    typeof title !== 'string' ||
    typeof content !== 'string' ||
    typeof startDate !== 'string'
    // typeof relatedEvents
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`
    })
  }

  const fieldErrors = {
    title: validateEventTitle(title),
    content: validateEventContent(content),
    startDate: validateEventStartDate(startDate),
    // relatedEvents: validateRelatedEvents(relatedEvents)
    relatedEvents: false
  }

  const fields = { title, content, startDate, timelineId, relatedEvents }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }
  console.log(1)

  const event = await createEvent({
    title,
    content,
    startDate: new Date(startDate),
    timelineId,
    userId,
    relatedEvents
  })

  console.log(2)
  console.log('event created', event)
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
          content={content}
          startDate={new Date(startDate)}
          title={title}
          events={[]} // TODO: Add correct events
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
      <div>
        <label className='flex flex-col gap-1 w-full'>
          <span>Title: </span>
          <input
            autoFocus
            ref={titleRef}
            defaultValue={actionData?.fields?.title}
            name='title'
            className='flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500'
            aria-invalid={Boolean(actionData?.fieldErrors?.title) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.title ? 'title-error' : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.title && (
          <div className='pt-1 text-red-700' id='title-error'>
            {actionData.fieldErrors.title}
          </div>
        )}
      </div>

      <div>
        <label className='flex flex-col gap-1 w-full'>
          <span>Content: </span>
          <textarea
            ref={contentRef}
            defaultValue={actionData?.fields?.content}
            name='content'
            rows={4}
            className='flex-1 py-2 px-3 w-full text-lg leading-6 rounded-md border-2 border-blue-500'
            aria-invalid={
              Boolean(actionData?.fieldErrors?.content) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.content ? 'content-error' : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.content && (
          <div className='pt-1 text-red-700' id='content-error'>
            {actionData.fieldErrors.content}
          </div>
        )}
      </div>

      <div>
        <label className='flex flex-col gap-1 w-full'>
          <span>Start Date: </span>
          <input
            ref={startDateRef}
            type='date'
            defaultValue={new Intl.DateTimeFormat('sv-SE').format(new Date())}
            name='startDate'
            className='flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500'
            aria-invalid={
              Boolean(actionData?.fieldErrors?.startDate) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.startDate ? 'startdate-error' : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.startDate && (
          <div className='pt-1 text-red-700' id='startdate-error'>
            {actionData.fieldErrors.startDate}
          </div>
        )}
      </div>

      <div>
        <label className='flex flex-col gap-1 w-full'>
          <span>Related events: </span>
          <select name='relatedEvents'>
            <option value={undefined}></option>
            {data.events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>
        {actionData?.fieldErrors?.relatedEvents && (
          <div className='pt-1 text-red-700' id='relatedevents-error'>
            {actionData.fieldErrors.relatedEvents}
          </div>
        )}
      </div>

      <div className='text-right'>
        <button
          type='submit'
          className='py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded'
        >
          Save
        </button>
      </div>
    </Form>
  )
}
