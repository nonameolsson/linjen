import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { z } from 'zod'

import { TextArea, TextField } from '~/components'

import { Page } from '~/components/page'
import { createTimeline } from '~/models/timeline.server'
import { requireUserId } from '~/session.server'
import { badRequestWithError } from '~/utils/index'

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' }), // TODO: Add translation
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Not a valid URL' }).or(z.string().max(0)) // TODO: Add validation for optional string URL. Meanwhile, client field validation is activated
})
type FormSchema = z.infer<typeof formSchema>

type ActionData = {
  formPayload?: FormSchema
  error?: any
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formPayload = Object.fromEntries(await request.formData())

  try {
    const result = formSchema.parse(formPayload)

    const { title, description, imageUrl } = result
    const timeline = await createTimeline({
      title,
      description,
      userId,
      imageUrl
    })

    return redirect(`/timeline/${timeline.id}/events`)
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

export default function NewTimelinePage() {
  const actionData = useActionData<ActionData>()

  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const imageUrlRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (actionData?.error?.title) {
      titleRef.current?.focus()
    } else if (actionData?.error?.description) {
      descriptionRef.current?.focus()
    } else if (actionData?.error?.imageUrl) {
      imageUrlRef.current?.focus()
    }
  }, [actionData])

  return (
    <Page
      title='New Timeline'
      showBackButton
      toolbarButtons={
        <button
          form='new-timeline'
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
              id='new-timeline'
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
                ref={titleRef}
                autoFocus
                name='title'
                id='title'
                label='Title'
                errorMessage={actionData?.error?.title?._errors[0]}
                placeholder='My awesome timeline'
                required
                defaultValue={actionData?.formPayload?.title}
                key={actionData?.formPayload?.title}
              />

              <TextArea
                name='description'
                className='mt-2'
                rows={4}
                ref={descriptionRef}
                label='Description'
                defaultValue={actionData?.formPayload?.description}
                errorMessage={actionData?.error?.description?._errors[0]}
              />

              <TextField
                name='imageUrl'
                ref={imageUrlRef}
                className='mt-2'
                id='imageUrl'
                label='Cover image (Optional)'
                type='url'
                errorMessage={actionData?.error?.imageUrl?._errors[0]}
                placeholder='https://myurl.com/image.png'
                defaultValue={actionData?.formPayload?.imageUrl}
              />
            </Form>
          </section>
        </main>
      </div>
    </Page>
  )
}
