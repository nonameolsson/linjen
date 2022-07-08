import { InformationCircleIcon } from '@heroicons/react/solid'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import * as React from 'react'
import { z } from 'zod'
import { TextField } from '~/components'

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
              Log in to your account
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Or{' '}
              <Link
                className='link link-primary'
                to={{
                  pathname: '/join',
                  search: searchParams.toString()
                }}
              >
                create a new account
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
                  autoComplete='current-password'
                  errorMessage={actionData?.error?.password?._errors[0]}
                />

                <div className='flex justify-between items-center'>
                  <div className='flex items-center form-control'>
                    <label htmlFor='remember' className='cursor-pointer label'>
                      <input
                        id='remember'
                        name='remember'
                        type='checkbox'
                        className='mr-2 checkbox'
                      />
                      <span className='label-text'>Remember me</span>
                    </label>
                  </div>
                </div>

                <input type='hidden' name='redirectTo' value={redirectTo} />
                <button className='btn btn-block' type='submit'>
                  Log in
                </button>
                {actionData?.formError && (
                  <div className='rounded-md bg-error p-4'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <InformationCircleIcon
                          className='h-5 w-5 text-error-content'
                          aria-hidden='true'
                        />
                      </div>
                      <p className='text-sm ml-3 text-error-content'>
                        {actionData.formError}
                      </p>
                    </div>
                  </div>
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
