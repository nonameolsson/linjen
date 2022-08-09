import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useCatch, useLoaderData } from '@remix-run/react'
import React from 'react'
import { z } from 'zod'

import { Page, PageHeader, TextArea, TextField } from '~/components'
import { Alert } from '~/components/alert'
import { Content } from '~/components/content'
import { createEvent } from '~/models/event.server'
import { requireUserId } from '~/session.server'
import { badRequestWithError } from '~/utils/index'

const formSchema = z.object({
  timelineId: z.string(),
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
  timelineId?: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url)

  const timelineId = url.searchParams.get('timelineId')
  return json({ timelineId })
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formPayload = Object.fromEntries(await request.formData())

  try {
    const result = formSchema.parse(formPayload)

    const { title, startDate, timelineId, content } = result

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

const NewEventButton = ({ className }: { className: string }) => (
  <button
    form='new-event'
    className={className}
    type='submit'
    name='action'
    value='update'
  >
    Save
  </button>
)

const pageTitle = 'New event'

export default function NewEventPage() {
  const loaderData = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()

  const titleRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLTextAreaElement>(null)
  const startDateRef = React.useRef<HTMLInputElement>(null)
  const timelineIdRef = React.useRef<HTMLInputElement>(null)

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
      title={pageTitle}
      showBackButton
      toolbarButtons={<NewEventButton className='btn btn-ghost' />}
    >
      <Content
        paddingMobile={true}
        desktopNavbar={
          <PageHeader
            title={pageTitle}
            actions={<NewEventButton className='btn btn-primary' />}
          />
        }
      >
        <Form
          className='col-start-4 col-span-6'
          replace
          id='new-event'
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
            defaultValue={actionData?.formPayload?.title}
            name='title'
            errorMessage={actionData?.error?.title?._errors[0]}
          />

          <TextArea
            ref={contentRef}
            label='Content'
            defaultValue={actionData?.formPayload?.content}
            name='content'
            rows={4}
            errorMessage={actionData?.error?.formPayload?.content._errors[0]}
          />

          <TextField
            type='date'
            ref={startDateRef}
            label='Start Date'
            defaultValue={
              actionData?.formPayload?.startDate
                ? new Intl.DateTimeFormat('sv-SE').format(
                    new Date(actionData?.formPayload?.startDate)
                  )
                : new Intl.DateTimeFormat('sv-SE').format(new Date())
            }
            name='startDate'
            errorMessage={actionData?.error?.startDate?._errors[0]}
          />

          <input
            type='hidden'
            ref={timelineIdRef}
            name='timelineId'
            defaultValue={loaderData.timelineId}
          />
        </Form>
      </Content>
    </Page>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <Page title={`${caught.status} ${caught.statusText}`}>
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <h1>App Error</h1>
            <Alert text={`${caught.status} ${caught.statusText}`} />
          </section>
        </main>
      </div>
    </Page>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Page title='Uh-oh!'>
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <h1>App Error</h1>
            <Alert text={error.message} />
          </section>
        </main>
      </div>
    </Page>
  )
}
