import {
  Box,
  Button,
  createStyles,
  Grid,
  Textarea,
  TextInput,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import type { Event } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { IconCalendar } from '@tabler/icons'
import * as React from 'react'
import invariant from 'tiny-invariant'
import { z } from 'zod'

import { Page } from '~/components'
import {
  getEvent,
  getEventListForTimeline,
  updateEvent
} from '~/models/event.server'
import { requireUserId } from '~/session.server'
import { badRequestWithError } from '~/utils/index'

const formSchema = z.object({
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
  event: Event
  availableEvents: Pick<Event, 'id' | 'title'>[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)

  invariant(params.eventId, 'eventId not found')

  const event = await getEvent(params.eventId)
  const availableEvents = await getEventListForTimeline(params.eventId)

  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ event, availableEvents })
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireUserId(request)
  const formPayload = Object.fromEntries(await request.formData())

  const eventId = params.eventId
  invariant(eventId, 'Event ID is required')

  try {
    const result = formSchema.parse(formPayload)

    const { title, startDate, content } = result

    await updateEvent(
      { content, startDate: new Date(startDate), title },
      eventId
    )

    return redirect(`/event/${params.eventId}`)
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

const pageTitle = 'Edit Event'

const useStyles = createStyles(theme => ({
  button: {
    float: 'right'
  }
}))

export default function EditEvent() {
  const loaderData = useLoaderData<LoaderData>()

  const { classes } = useStyles()
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)

  const actionData = useActionData() as ActionData
  const titleRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLTextAreaElement>(null)
  const startDateRef = React.useRef<HTMLInputElement>(null)

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
      toolbarButtons={
        mobile ? (
          <UnstyledButton
            form='edit-event'
            type='submit'
            name='action'
            value='update'
          >
            Save
          </UnstyledButton>
        ) : undefined
      }
    >
      <Box px='md'>
        <Grid justify='center'>
          <Grid.Col span={12} md={6}>
            <Form replace method='post' id='edit-event'>
              <TextInput
                defaultValue={loaderData.event.title}
                error={actionData?.error?.title?._errors[0]}
                label='Title'
                name='title'
                ref={titleRef}
              />

              <Textarea
                defaultValue={loaderData.event.content || ''}
                error={actionData?.error?.content?._errors[0]}
                label='Content'
                mt='md'
                name='content'
                ref={contentRef}
                rows={4}
              />

              <DatePicker
                dropdownType='modal'
                error={actionData?.error?.startDate?._errors[0]}
                icon={<IconCalendar size={16} />}
                label='Start Date'
                mt='md'
                name='startDate'
                ref={startDateRef}
                defaultValue={new Date(loaderData.event.startDate)}
              />

              {!mobile && (
                <Button mt='md' className={classes.button} type='submit'>
                  Save
                </Button>
              )}
            </Form>
          </Grid.Col>
        </Grid>
      </Box>
    </Page>
  )
}
