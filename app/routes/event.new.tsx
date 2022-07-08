import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import React from 'react'
import { Page, TextArea, TextField } from '~/components'
import { createEvent } from '~/models/event.server'
import { requireUserId } from '~/session.server'

function validateEventTitle(title: string) {
  if (title.length < 5) {
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

type LoaderData = {
  timelineId?: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url)

  const timelineId = url.searchParams.get('timelineId')
  return json({ timelineId })
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()

  const title = formData.get('title')
  const content = formData.get('content')
  const startDate = formData.get('startDate')
  const timelineId = formData.get('timelineId')

  if (
    typeof title !== 'string' ||
    typeof content !== 'string' ||
    typeof startDate !== 'string' ||
    typeof timelineId !== 'string'
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

  const event = await createEvent({
    data: {
      title,
      content,
      startDate: new Date(startDate)
    },
    timelineId,
    userId
  })

  return redirect(`/event/${event.id}`)
}

export default function NewEventPage() {
  const data = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData | undefined>()
  const titleRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLTextAreaElement>(null)
  const startDateRef = React.useRef<HTMLInputElement>(null)
  const timelineIdRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (actionData?.fieldErrors?.title) {
      titleRef.current?.focus()
    } else if (actionData?.fieldErrors?.content) {
      contentRef.current?.focus()
    } else if (actionData?.fieldErrors?.startDate) {
      startDateRef.current?.focus()
    }
  }, [actionData])

  return (
    <Page title='Add event' showBackButton>
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
          autoFocus
          ref={titleRef}
          label='Title'
          defaultValue={actionData?.fields?.title}
          name='title'
          errorMessage={actionData?.fieldErrors?.title}
        />

        <TextArea
          ref={contentRef}
          label='Content'
          defaultValue={actionData?.fields?.content}
          name='content'
          rows={4}
          errorMessage={actionData?.fieldErrors?.content}
        />

        <TextField
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

        <input
          type='hidden'
          ref={timelineIdRef}
          name='timelineId'
          defaultValue={data.timelineId}
        />

        <div className='text-right'>
          <button type='submit' className='btn btn-primary'>
            Save
          </button>
        </div>
      </Form>
    </Page>
  )
}
