import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import * as React from 'react'

import { createUserSession, getUserId } from '~/session.server'

import { TextField } from '~/components'
import { createUser, getUserByEmail } from '~/models/user.server'
import { safeRedirect, validateEmail } from '~/utils'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

interface ActionData {
  errors: {
    email?: string
    password?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: 'Email is invalid' } },
      { status: 400 }
    )
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json<ActionData>(
      { errors: { password: 'Password is required' } },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: 'Password is too short' } },
      { status: 400 }
    )
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: 'A user already exists with this email' } },
      { status: 400 }
    )
  }

  const user = await createUser(email, password)

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo
  })
}

export const meta: MetaFunction = () => {
  return {
    title: 'Sign Up'
  }
}

export default function Join() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
  const actionData = useActionData() as ActionData
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus()
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus()
    }
  }, [actionData])

  return (
    <div className='flex min-h-full'>
      <div className='flex flex-col flex-1 justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-sm lg:w-96'>
          <div>
            <img
              className='w-auto h-12'
              src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
              alt='Workflow'
            />
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
            <Form method='post'>
              <div className='space-y-4'>
                <TextField
                  ref={emailRef}
                  id='email'
                  label='Email'
                  required
                  autoFocus={true}
                  name='email'
                  type='email'
                  autoComplete='email'
                  errorMessage={actionData?.errors?.email}
                />

                <TextField
                  id='password'
                  ref={passwordRef}
                  name='password'
                  type='password'
                  label='Password'
                  autoComplete='new-password'
                  errorMessage={actionData?.errors?.password}
                />
              </div>
              <input type='hidden' name='redirectTo' value={redirectTo} />

              <button className='mt-8 btn btn-block' type='submit'>
                Create account
              </button>
            </Form>
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
