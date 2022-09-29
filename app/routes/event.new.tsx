import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useCatch, useLoaderData } from '@remix-run/react'
import React from 'react'
import { z } from 'zod'

import {
  Alert,
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  Textarea,
  TextInput,
  Title,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'

import { IconCalendar } from '@tabler/icons'
import { Page } from '~/components'
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

const pageTitle = 'New event'

const useStyles = createStyles(theme => ({
  button: {
    float: 'right'
  }
}))

export default function NewEventPage() {
  const loaderData = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()

  const { classes } = useStyles()
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)

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
      toolbarButtons={
        mobile ? (
          <UnstyledButton
            form='new-event'
            type='submit'
            name='action'
            value='update'
          >
            Save
          </UnstyledButton>
        ) : undefined
      }
    >
      <Box px='xl'>
        <Grid justify='center'>
          <Grid.Col span={12} md={6}>
            <Form replace id='new-event' method='post'>
              <TextInput
                autoFocus
                defaultValue={actionData?.formPayload?.title}
                error={actionData?.error?.title?._errors[0]}
                label='Title'
                name='title'
                placeholder='My awesome event'
                ref={titleRef}
                required
                withAsterisk
              />

              <Textarea
                defaultValue={actionData?.formPayload?.content}
                error={actionData?.error?.formPayload?.content._errors[0]}
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
                placeholder='Pick date'
                ref={startDateRef}
                defaultValue={
                  actionData?.formPayload?.startDate
                    ? new Date(actionData?.formPayload?.startDate)
                    : new Date()
                }
              />

              <input
                type='hidden'
                ref={timelineIdRef}
                name='timelineId'
                defaultValue={loaderData.timelineId}
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

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <Page title={`${caught.status} ${caught.statusText}`}>
      <Container fluid>
        <Title>App Error</Title>
        <Alert color='red'>{`${caught.status} ${caught.statusText}`}</Alert>
      </Container>
    </Page>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Page title='Uh-oh!'>
      <Container fluid>
        <Title>App Error</Title>
        <Alert color='red'>{error.message}</Alert>
      </Container>
    </Page>
  )
}
