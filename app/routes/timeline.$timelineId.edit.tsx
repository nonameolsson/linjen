import { ExclamationCircleIcon } from '@heroicons/react/outline'
import type { Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import invariant from 'tiny-invariant'
import { Page } from '~/components/page'
import { getTimeline, updateTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'


type LoaderData = {
  timeline: Timeline
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  const timeline = await getTimeline({ createdById: userId, id: params.timelineId })
  if (!timeline) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ timeline })
}
type ActionData = {
  errors?: {
    title?: string
    description?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const id = formData.get('timelineId')

  if (typeof title !== 'string' || title.length === 0) {
    return json<ActionData>(
      { errors: { title: 'Title is required' } },
      { status: 400 }
    )
  }

  if (typeof description !== 'string' || description.length === 0) {
    return json<ActionData>(
      { errors: { description: 'Description is required' } },
      { status: 400 }
    )
  }

  if (typeof id !== 'string' || id.length === 0) {
    return json<ActionData>(
      { errors: { description: 'id is required' } },
      { status: 400 }
    )
  }

  const timeline = await updateTimeline({ title, description, userId, id })

  return redirect(`/timeline/${timeline.id}/events`)
}

export default function EditTimelinePage() {
  const data = useLoaderData<LoaderData>()
  const actionData = useActionData() as ActionData
  const titleRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus()
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus()
    }
  }, [actionData])

  return (
    <Page title='Edit Timeline'>
      <Form
        method='post'
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: '100%'
        }}
      >
        <input type='hidden' name='timelineId' value={data.timeline.id} />
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700'
          >
            Title:
          </label>
          <div className='mt-1'>
            <input
              id='title'
              ref={titleRef}
              name='title'
              className='flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500'
              aria-invalid={actionData?.errors?.title ? true : undefined}
              aria-errormessage={
                actionData?.errors?.title ? 'title-error' : undefined
              }
              defaultValue={data.timeline.title}
              aria-describedby='email-error'
            />
            {actionData?.errors?.title && (
              <div className='flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none'>
                <ExclamationCircleIcon
                  className='w-5 h-5 text-red-500'
                  aria-hidden='true'
                />
              </div>
            )}
            {actionData?.errors?.title && (
              <p className='mt-2 text-sm text-red-600' id='title-error'>
                {actionData.errors.title}
              </p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor='comment'
            className='block text-sm font-medium text-gray-700'
          >
            Description
          </label>
          <div className='mt-1'>
            <textarea
              rows={4}
              name='description'
              ref={descriptionRef}
              className='block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm'
              defaultValue={data.timeline.description}
              aria-invalid={actionData?.errors?.description ? true : undefined}
              aria-errormessage={
                actionData?.errors?.description ? 'body-error' : undefined
              }
            />
          </div>
          {actionData?.errors?.description && (
            <div className='pt-1 text-red-700' id='body-error'>
              {actionData.errors.description}
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
    </Page>
  )
}
