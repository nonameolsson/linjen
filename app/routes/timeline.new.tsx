import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import * as React from 'react'
import { Button, TextArea, TextField } from '~/components'

import { Page } from '~/components/page'
import { createTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

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

  const timeline = await createTimeline({
    title,
    description,
    userId,
    imageUrl
  })

  return redirect(`/timeline/${timeline.id}/events`)
}

export default function NewTimelinePage() {
  const actionData = useActionData() as ActionData
  const titleRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null)
  const imageUrlRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus()
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus()
    } else if (actionData?.errors?.imageUrl) {
      imageUrlRef.current?.focus()
    }
  }, [actionData])

  return (
    <Page title='New Timeline'>
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
          id='title'
          label='Title'
          ref={titleRef}
          name='title'
          errorMessage={actionData?.errors?.title}
          placeholder='My awesome timeline'
          defaultValue=''
        />

        <TextArea
          className='mt-2'
          rows={4}
          name='description'
          ref={descriptionRef}
          label='Description'
          defaultValue={''}
          errorMessage={actionData?.errors?.description}
        />

        <TextField
          className='mt-2'
          id='imageUrl'
          label='Cover image (Optional)'
          ref={titleRef}
          name='imageUrl'
          errorMessage={actionData?.errors?.title}
          placeholder='https://myurl.com/image.png'
          defaultValue=''
        />

        <div className='text-right'>
          <Button type='submit'>Save</Button>
        </div>
      </Form>
    </Page>
  )
}
