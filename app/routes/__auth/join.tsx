import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import * as React from 'react'

import { createUserSession, getUserId } from '~/session.server'

import {
  Alert,
  Anchor,
  Button,
  Container,
  Image,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons'
import { z } from 'zod'
import { createUser, getUserByEmail } from '~/models/user.server'
import { safeRedirect } from '~/utils'
import { badRequestWithError } from '~/utils/index'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'The password must be at least 8 characters long' }),
  redirectTo: z.string().optional()
})
type FormSchema = z.infer<typeof formSchema>

type ActionData = {
  formPayload?: FormSchema
  formError?: any
  error?: any
}

export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData())

  try {
    const result = formSchema.parse(formPayload)
    const { email, password, redirectTo } = result

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return json<ActionData>(
        { formError: { email: 'A user already exists with this email' } },
        { status: 400 }
      )
    }

    const user = await createUser(email, password)
    const redirectURL = safeRedirect(redirectTo, '/')

    return createUserSession({
      request,
      userId: user.id,
      remember: false,
      redirectTo: redirectURL
    })
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

export const meta: MetaFunction = () => {
  return {
    title: 'Sign Up'
  }
}

export default function Join() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
  const actionData = useActionData<ActionData>()
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (actionData?.error?.email) {
      emailRef.current?.focus()
    } else if (actionData?.error?.password) {
      passwordRef.current?.focus()
    }
  }, [actionData])

  return (
    <Container size='xs' px='xs'>
      <Title align='center' order={1}>
        Create a new account
      </Title>
      <Image src='images/landing.jpg' alt='Timelines and events' mb='md' />

      <Form method='post'>
        <TextInput
          ref={emailRef}
          id='email'
          label='Email'
          required
          autoFocus={true}
          name='email'
          type='email'
          autoComplete='email'
          error={actionData?.error?.email?._errors[0]}
        />

        <PasswordInput
          id='password'
          ref={passwordRef}
          name='password'
          label='Password'
          autoComplete='current-password'
          error={actionData?.error?.password?._errors[0]}
        />

        <input type='hidden' name='redirectTo' value={redirectTo} />

        {actionData?.formError?.email && (
          <Alert mt='md' color='red' icon={<IconAlertCircle size={16} />}>
            {actionData.formError.email}
          </Alert>
        )}

        <Button fullWidth mt='md' type='submit'>
          Create account
        </Button>
      </Form>

      <Space mt='md' />

      <Text>Already have an account?</Text>
      <Anchor
        component={Link}
        to={{
          pathname: '/login',
          search: searchParams.toString()
        }}
      >
        Click here to log in.
      </Anchor>
    </Container>
  )
}
