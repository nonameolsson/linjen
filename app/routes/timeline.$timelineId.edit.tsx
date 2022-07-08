import type { Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { getParams, useFormInputProps } from 'remix-params-helper'
import { z } from 'zod'

import { Page, TextArea, TextField } from '~/components'
import { getTimeline, updateTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  timeline: Timeline
}

const ParamsSchema = z.object({
  timelineId: z.string()
})
// type ParamsType = z.infer<typeof ParamsSchema>

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)

  const paramsResult = getParams(params, ParamsSchema)
  if (!paramsResult.success) {
    // Sometimes your code just blows up and you never anticipated it. Remix will
    // automatically catch it and send the UI to the error boundary.
    throw json(paramsResult.errors, {
      status: 400
    })
  }

  const { timelineId } = paramsResult.data
  const timeline = await getTimeline({
    userId,
    id: timelineId
  })

  if (!timeline) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ timeline })
}

const ActionSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' }),
  description: z.string().optional(),
  imageUrl: z.string().optional() // TODO: Add validation for optional string URL. Meanwhile, client field validation is activated
})
type ActionType = z.infer<typeof ActionSchema> // Infer the schema from Zod

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  let formData = await request.formData()
  const paramsData = getParams(params, ParamsSchema)
  const requestData = getParams(formData, ActionSchema)

  if (!paramsData.success) {
    throw json(paramsData.errors, {
      status: 400
    })
  }

  if (!requestData.success) {
    return json(requestData.errors, {
      status: 400
    })
  }

  // these variables will be typed and valid
  const { title, description, imageUrl } = requestData.data

  const timeline = await updateTimeline({
    description,
    title,
    userId,
    imageUrl,
    id: paramsData.data.timelineId
  })

  return redirect(`/timeline/${timeline.id}/events`)
}

export default function EditTimelinePage() {
  const loaderData = useLoaderData<LoaderData>()
  const actionMessage = useActionData<ActionType>()
  let focusRef = useRef<HTMLInputElement>(null)
  const inputProps = useFormInputProps(ActionSchema)

  useEffect(() => {
    if (actionMessage && focusRef.current) {
      focusRef.current.select()
    }
  }, [actionMessage])

  return (
    <Page
      title='Edit Timeline'
      showBackButton
      toolbarButtons={
        <button
          form='edit-timeline'
          className='btn btn-ghost'
          type='submit'
          name='action'
          value='update'
        >
          Save
        </button>
      }
    >
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
            <Form
              id='edit-timeline'
              replace
              method='post'
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                width: '100%'
              }}
            >
              <input
                type='hidden'
                name='timelineId'
                value={loaderData.timeline.id}
              />

              <TextField
                {...inputProps('title')}
                id='title'
                label='Title'
                ref={focusRef}
                errorMessage={actionMessage?.title}
                defaultValue={loaderData.timeline.title}
                key={loaderData?.timeline.title}
              />

              <TextArea
                {...inputProps('description', { required: false })}
                rows={4}
                className='mt-2'
                label='Description'
                defaultValue={loaderData.timeline.description || ''}
                errorMessage={actionMessage?.description}
                required={false}
                key={loaderData?.timeline.description}
              />

              <TextField
                {...inputProps('imageUrl')}
                id='imageUrl'
                label='Cover image (Optional)'
                errorMessage={actionMessage?.imageUrl}
                placeholder='https://myurl.com/image.png'
                defaultValue={loaderData.timeline.imageUrl || ''}
                required={false}
                key={loaderData?.timeline.imageUrl}
              />
            </Form>
          </section>
        </main>
      </div>
    </Page>
  )
}
