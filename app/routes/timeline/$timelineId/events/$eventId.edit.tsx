import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition
} from '@remix-run/react'
import * as React from 'react'

import { getEvent, updateEvent } from '~/models/event.server'
import { requireUserId } from '~/session.server'
import invariant from 'tiny-invariant'
import type { Event } from '@prisma/client'
import EventCard from '~/components/event-card'

type LoaderData = {
  event: Event
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

  const event = await getEvent({ id: params.eventId })
  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ event })
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
  const userId = await requireUserId(request)
  const formData = await request.formData()

  const timelineId = params.timelineId
  invariant(timelineId, 'Timeline ID is required')

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

  const fields = { title, content, startDate, timelineId }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  await updateEvent({
    title,
    content,
    startDate,
    userId,
    id: eventId
  })

  return redirect(`/timeline/${params.timelineId}/events/${params.eventId}`)
}

export default function EditEvent() {
  const data = useLoaderData<LoaderData | undefined>()
  const transition = useTransition()

  const actionData = useActionData() as ActionData
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
      return <EventCard content={content} startDate={startDate} title={title} />
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
        <label className='flex w-full flex-col gap-1'>
          <span>Title: </span>
          <input
            defaultValue={data?.event.title}
            ref={titleRef}
            name='title'
            className='flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose'
            aria-invalid={actionData?.fieldErrors?.title ? true : undefined}
            aria-errormessage={
              actionData?.fieldErrors?.title ? 'title-error' : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.title && (
          <div className='pt-1 text-red-700' id='title-error'>
            {actionData?.fieldErrors?.title}
          </div>
        )}
      </div>

      <div>
        <label className='flex w-full flex-col gap-1'>
          <span>Content: </span>
          <textarea
            defaultValue={data?.event.content || ''}
            ref={contentRef}
            name='content'
            rows={4}
            className='w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6'
            aria-invalid={actionData?.fieldErrors?.content ? true : undefined}
            aria-errormessage={
              actionData?.fieldErrors?.content ? 'body-error' : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.content && (
          <div className='pt-1 text-red-700' id='body-error'>
            {actionData?.fieldErrors?.content}
          </div>
        )}
      </div>

      <div>
        <label className='flex w-full flex-col gap-1'>
          <span>Start Date: </span>
          <input
            ref={startDateRef}
            type='number'
            defaultValue={data?.event.startDate}
            name='startDate'
            className='flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose'
            aria-invalid={actionData?.fieldErrors?.startDate ? true : undefined}
            aria-errormessage={
              actionData?.fieldErrors?.startDate ? 'body-error' : undefined
            }
          />
        </label>
        {actionData?.fieldErrors?.startDate && (
          <div className='pt-1 text-red-700' id='body-error'>
            {actionData?.fieldErrors?.startDate}
          </div>
        )}
      </div>

      <div className='text-right'>
        <button
          type='submit'
          className='rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
        >
          Save
        </button>
      </div>
    </Form>
  )
}
