import type { Timeline } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import invariant from 'tiny-invariant'

import { Button, Page, TextArea, TextField } from '~/components'
import { getTimeline, updateTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  timeline: Timeline
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  const timeline = await getTimeline({
    userId,
    id: params.timelineId
  })
  if (!timeline) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ timeline })
}
type ActionData = {
  errors?: {
    title?: string
    description?: string
    imageUrl?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const id = formData.get('timelineId')
  const imageUrl = formData.get('imageUrl')

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

  if (typeof imageUrl !== 'string') {
    return json<ActionData>(
      { errors: { imageUrl: 'imageUrl is not a string' } },
      { status: 400 }
    )
  }

  const timeline = await updateTimeline({
    title,
    description,
    userId,
    id,
    imageUrl
  })

  return redirect(`/timeline/${timeline.id}/events`)
}

export default function EditTimelinePage() {
  const data = useLoaderData<LoaderData>()
  const actionData = useActionData() as ActionData
  const titleRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null)
  const imageUrlRef = React.useRef<HTMLInputElement>(null)

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
        replace
        method='post'
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: '100%'
        }}
      >
        <input type='hidden' name='timelineId' value={data.timeline.id} />

        <TextField
          className='mt-1'
          id='title'
          label='Title'
          ref={titleRef}
          name='title'
          errorMessage={actionData?.errors?.title}
          defaultValue={data.timeline.title}
        />

        <TextArea
          rows={4}
          className='mt-2'
          label='Description'
          name='description'
          ref={descriptionRef}
          defaultValue={data.timeline.description}
          errorMessage={actionData?.errors?.description}
        />

        <TextField
          className='mt-2'
          id='imageUrl'
          label='Cover image (Optional)'
          ref={imageUrlRef}
          name='imageUrl'
          errorMessage={actionData?.errors?.title}
          placeholder='https://myurl.com/image.png'
          defaultValue={data.timeline.imageUrl || ''}
        />
        <div className='text-right'>
          <Button type='submit'>Save</Button>
        </div>
      </Form>
    </Page>
  )
}
