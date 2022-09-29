import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  PasswordInput,
  Text,
  TextInput
} from '@mantine/core'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { IconAlertCircle } from '@tabler/icons'
import { z } from 'zod'
import { Authentication } from '~/components/authentication'

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

  return (
    <Authentication title='Welcome to Linjen!'>
      <Form method='post'>
        <TextInput
          autoComplete='email'
          autoFocus={true}
          error={actionData?.error?.email?._errors[0]}
          id='email'
          label='Email address'
          name='email'
          placeholder='hello@gmail.com'
          required
          size='md'
          type='email'
        />

        <PasswordInput
          autoComplete='current-password'
          error={actionData?.error?.password?._errors[0]}
          id='password'
          label='Password'
          mt='md'
          name='password'
          placeholder='Your password'
          size='md'
        />

        <Checkbox label='Keep me logged in' mt='xl' size='md' />

        <input type='hidden' name='redirectTo' value={redirectTo} />

        {actionData?.formError && (
          <Alert
            mt='md'
            icon={<IconAlertCircle size={16} />}
            title='Bummer!'
            color='red'
          >
            {actionData.formError}
          </Alert>
        )}

        <Button fullWidth mt='xl' size='md' type='submit'>
          Login
        </Button>
      </Form>

      <Text align='center' mt='md'>
        Don&apos;t have an account?{' '}
        <Anchor
          component={Link}
          to={{
            pathname: '/join',
            search: searchParams.toString()
          }}
          weight={700}
        >
          Register
        </Anchor>
      </Text>
    </Authentication>
  )
}
