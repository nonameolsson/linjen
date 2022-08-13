import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Container,
  Image,
  PasswordInput,
  Space,
  TextInput,
  Title
} from '@mantine/core'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { IconAlertCircle } from '@tabler/icons'
import * as React from 'react'
import { z } from 'zod'

import { verifyLogin } from '~/models/user.server'
import { createUserSession, getUserId } from '~/session.server'
import { safeRedirect } from '~/utils'
import { badRequestWithError } from '~/utils/index'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember: z.enum(['on', 'off']).optional(),
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
    const { email, password, remember, redirectTo } = result

    const user = await verifyLogin(email, password)
    const redirectURL = safeRedirect(redirectTo, '/timelines')

    if (!user) {
      return json<ActionData>(
        { formError: 'Invalid email or password' },
        { status: 400 }
      )
    }

    return createUserSession({
      request,
      userId: user.id,
      remember: remember === 'on' ? true : false,
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
    title: 'Login'
  }
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/timelines'
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
        Log in to your account
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
        {console.log(actionData)}

        <PasswordInput
          id='password'
          ref={passwordRef}
          name='password'
          label='Password'
          autoComplete='current-password'
          error={actionData?.error?.password?._errors[0]}
        />

        <Checkbox label='Remember me' id='remember' name='remember' mt='md' />

        <input type='hidden' name='redirectTo' value={redirectTo} />

        {actionData?.formError && (
          <Alert mt='md' color='red' icon={<IconAlertCircle size={16} />}>
            {actionData.formError}
          </Alert>
        )}

        <Button fullWidth mt='md' type='submit'>
          Log in
        </Button>
      </Form>

      <Space mt='md' />

      <Anchor
        component={Link}
        to={{
          pathname: '/join',
          search: searchParams.toString()
        }}
      >
        Create a new account
      </Anchor>
    </Container>
  )
}
