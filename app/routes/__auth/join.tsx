import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import * as React from 'react'

import { createUserSession, getUserId } from '~/session.server'

import { z } from 'zod'
import { TextField } from '~/components'
import { Alert } from '~/components/alert'
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
    <div className='flex min-h-full'>
      <div className='flex flex-col flex-1 justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-sm lg:w-96'>
          <div>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
              Create a new account
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Or{' '}
              <Link
                className='link link-primary'
                to={{
                  pathname: '/login',
                  search: searchParams.toString()
                }}
              >
                log in with an existing account
              </Link>
            </p>
          </div>

          <div className='mt-8'>
            <div className='mt-6'>
              <Form method='post' className='space-y-6'>
                <TextField
                  ref={emailRef}
                  id='email'
                  label='Email'
                  required
                  autoFocus={true}
                  name='email'
                  type='email'
                  autoComplete='email'
                  errorMessage={actionData?.error?.email?._errors[0]}
                />

                <TextField
                  id='password'
                  ref={passwordRef}
                  name='password'
                  type='password'
                  label='Password'
                  autoComplete='new-password'
                  errorMessage={actionData?.error?.password?._errors[0]}
                />
                <input type='hidden' name='redirectTo' value={redirectTo} />

                <button className='mt-8 btn btn-block' type='submit'>
                  Create account
                </button>
                {actionData?.formError?.email && (
                  <Alert text={actionData.formError.email} />
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className='hidden flex-1 items-center bg-white lg:flex'>
        <img
          className='relative'
          src='images/landing.jpg'
          alt='Timelines and events'
        />
      </div>
    </div>
  )
}
