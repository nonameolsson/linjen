import { Button, Group, TextInput } from '@mantine/core'
import type { ContextModalProps } from '@mantine/modals'
import { useActionData, useFetcher, useTransition } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { z } from 'zod'

export const linkFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' }), // TODO: Add translation
  url: z.string().url()
})

export type LinkFormSchema = z.infer<typeof linkFormSchema> // Infer the schema from Zod

type ActionData = {
  formPayload?: LinkFormSchema
  error?: any
}

export function NewLinkDialog({
  context,
  id,
  innerProps
}: ContextModalProps<{ eventId: string }>): JSX.Element {
  const transition = useTransition()
  const fetcher = useFetcher()
  const actionData = useActionData<ActionData>()
  const titleRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (fetcher.type === 'done' && fetcher.data.ok) {
      context.closeModal(id)
    }
  }, [fetcher.type, fetcher.data, context, id])

  useEffect(() => {
    if (actionData?.error?.title) {
      titleRef.current?.focus()
    } else if (actionData?.error?.content) {
      urlRef.current?.focus()
    }
  }, [actionData])

  function closeModal() {
    context.closeModal(id)
  }

  return (
    <fetcher.Form
      id='new-link'
      method='post'
      action={`/event/${innerProps.eventId}`}
    >
      <TextInput
        name='title'
        label='Title'
        ref={titleRef}
        mt='md'
        error={fetcher.data?.error?.title?._errors[0]}
      />
      <TextInput
        name='url'
        type='url'
        label='URL'
        mt='md'
        ref={urlRef}
        error={fetcher.data?.error?.url?._errors[0]}
      />

      <Group mt='md' position='apart'>
        <Button variant='default' onClick={closeModal} name='action'>
          Cancel
        </Button>
        <Button
          disabled={transition.state === 'submitting'}
          name='action'
          value='_add-link'
          type='submit'
        >
          Save
        </Button>
      </Group>
    </fetcher.Form>
  )
}
