import {
  Button,
  createStyles,
  Grid,
  Textarea,
  TextInput,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { z } from 'zod'

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

const pageTitle = 'New Timeline'

const useStyles = createStyles(theme => ({
  button: {
    float: 'right'
  }
}))

export default function NewTimelinePage() {
  const actionData = useActionData<ActionData>()
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
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
      title={pageTitle}
      showBackButton
      toolbarButtons={
        mobile ? (
          <UnstyledButton
            form='new-timeline'
            type='submit'
            name='action'
            value='update'
          >
            Save
          </UnstyledButton>
        ) : undefined
      }
    >
      <Grid justify='center'>
        <Grid.Col span={12} md={6}>
          <Form id='new-timeline' replace method='post'>
            <TextInput
              ref={titleRef}
              autoFocus
              name='title'
              id='title'
              label='Title'
              mt='md'
              error={actionData?.error?.title?._errors[0]}
              placeholder='My awesome timeline'
              required
              defaultValue={actionData?.formPayload?.title}
              key={actionData?.formPayload?.title}
            />

            <Textarea
              name='description'
              className='mt-2'
              rows={4}
              mt='md'
              ref={descriptionRef}
              label='Description'
              defaultValue={actionData?.formPayload?.description}
              error={actionData?.error?.description?._errors[0]}
            />

            <TextInput
              name='imageUrl'
              ref={imageUrlRef}
              className='mt-2'
              id='imageUrl'
              label='Cover image (Optional)'
              mt='md'
              type='url'
              error={actionData?.error?.imageUrl?._errors[0]}
              placeholder='https://myurl.com/image.png'
              defaultValue={actionData?.formPayload?.imageUrl}
            />

            <Button mt='md' className={classes.button}>
              Save
            </Button>
          </Form>
        </Grid.Col>
      </Grid>
    </Page>
  )
}
