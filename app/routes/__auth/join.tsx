import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import * as React from 'react'

import { getUserId, createUserSession } from '~/session.server'

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
    <div className='flex flex-col justify-center min-h-full'>
      <div className='px-8 mx-auto w-full max-w-md'>
        <Form method='post' className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email address
            </label>
            <div className='mt-1'>
              <input
                ref={emailRef}
                id='email'
                required
                autoFocus={true}
                name='email'
                type='email'
                autoComplete='email'
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby='email-error'
                className='py-1 px-2 w-full text-lg rounded border border-gray-500'
              />
              {actionData?.errors?.email && (
                <div className='pt-1 text-red-700' id='email-error'>
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='mt-1'>
              <input
                id='password'
                ref={passwordRef}
                name='password'
                type='password'
                autoComplete='new-password'
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby='password-error'
                className='py-1 px-2 w-full text-lg rounded border border-gray-500'
              />
              {actionData?.errors?.password && (
                <div className='pt-1 text-red-700' id='password-error'>
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type='hidden' name='redirectTo' value={redirectTo} />
          <button
            type='submit'
            className='py-2 px-4 w-full  text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded'
          >
            Create Account
          </button>
          <div className='flex justify-center items-center'>
            <div className='text-sm text-center text-gray-500'>
              Already have an account?{' '}
              <Link
                className='text-blue-500 underline'
                to={{
                  pathname: '/login',
                  search: searchParams.toString()
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}
