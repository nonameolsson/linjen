import { Link } from '@remix-run/react'

import { useOptionalUser } from '~/utils'

export default function Index() {
  const user = useOptionalUser()

  return (
    <main className='relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center'>
      <div className='relative sm:pt-8 sm:pb-16'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='relative shadow-xl sm:overflow-hidden sm:rounded-2xl'>
            <div className='absolute inset-0'>
              <img
                className='h-full w-full object-cover'
                src='https://user-images.githubusercontent.com/1500684/157774694-99820c51-8165-4908-a031-34fc371ac0d6.jpg'
                alt='Sonic Youth On Stage'
              />
              <div className='absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply' />
            </div>
            <div className='lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32'>
              <h1 className='text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl'>
                <span className='block uppercase text-yellow-500 drop-shadow-md'>
                  Linjen
                </span>
              </h1>
              <p className='mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl'>
                Create and visualize your own timelines.
              </p>
              <div className='mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center'>
                {user ? (
                  <Link
                    to='/timelines'
                    className='flex items-center justify-center rounded-md border border-transparent bg-white py-3 px-4 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8'
                  >
                    View Timelines for {user.email}
                  </Link>
                ) : (
                  <div className='space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0'>
                    <Link
                      to='/join'
                      className='flex items-center justify-center rounded-md border border-transparent bg-white py-3 px-4 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8'
                    >
                      Sign up
                    </Link>
                    <Link
                      to='/login'
                      className='flex items-center justify-center rounded-md bg-yellow-500 py-3 px-4 font-medium text-white hover:bg-yellow-600  '
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
