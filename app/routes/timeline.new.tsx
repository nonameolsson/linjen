import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useRef } from 'react'
import { getParams } from 'remix-params-helper'
import { z } from 'zod'

import { Button, TextArea, TextField } from '~/components'

import { Page } from '~/components/page'
import { createTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'

const ActionSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' }),
  description: z.string().optional(),
  imageUrl: z.string().optional() // TODO: Add validation for optional string URL. Meanwhile, client field validation is activated
})

// type ActionType = z.infer<typeof ActionSchema> // Infer the schema from Zod

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  let formData = await request.formData()
  const result = getParams(formData, ActionSchema)

  if (!result.success) {
    const err = json(result.errors, { status: 400 })
    return err
  }

  // these variables will be typed and valid
  const { title, description, imageUrl } = result.data

  const timeline = await createTimeline({
    title,
    description,
    userId,
    imageUrl
  })

  return redirect(`/timeline/${timeline.id}/events`)
}

export default function NewTimelinePage() {
  let actionData = useActionData<{
    title?: string
    description?: string
    imageUrl?: string
  }>()
  let focusRef = useRef<HTMLInputElement>(null)

  return (
    <Page title='New Timeline' showBackButton>
      <div className='flex flex-1 items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4'>
          <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
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
                ref={focusRef}
                autoFocus
                id='title'
                label='Title'
                name='title'
                errorMessage={actionData?.title}
                placeholder='My awesome timeline'
                required
                // defaultValue={actionData?.formPayload?.title}
                // key={actionData?.formPayload?.title}
              />

              <TextArea
                className='mt-2'
                rows={4}
                name='description'
                // ref={descriptionRef}
                label='Description'
                defaultValue={''}
                errorMessage={actionData?.description}
              />

              <TextField
                className='mt-2'
                id='imageUrl'
                label='Cover image (Optional)'
                // ref={titleRef}
                name='imageUrl'
                type='url'
                errorMessage={actionData?.imageUrl}
                placeholder='https://myurl.com/image.png'
                defaultValue=''
              />

              <div className='text-right'>
                <Button type='submit'>Save</Button>
              </div>
            </Form>
          </section>
        </main>
      </div>
    </Page>
  )
}
