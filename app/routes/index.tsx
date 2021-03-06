import { Link } from '@remix-run/react'
import { useOptionalUser } from '~/utils'

export default function Index() {
  const user = useOptionalUser()

  return (
    <main className='relative min-h-screen bg-white sm:flex sm:justify-center sm:items-center'>
      <div
        className='absolute inset-0 w-full h-full bg-center bg-no-repeat bg-contain'
        style={{ backgroundImage: "url('/images/landing.jpg')" }}
      />
      <div className='relative bg-white/10 shadow-xl backdrop-blur-3xl sm:overflow-hidden sm:rounded-2xl'>
        <div className='mx-auto max-w-4xl sm:px-6 lg:px-8'>
          <div className='relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32 lg:pb-20'>
            <h1 className='text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl'>
              <span className='block text-white uppercase drop-shadow-md'>
                Linjen
              </span>
            </h1>
            <p className='mx-auto mt-6 max-w-lg text-xl text-center text-white sm:max-w-3xl'>
              Create and visualize your own timelines.
            </p>
            <div className='mx-auto mt-10 max-w-sm sm:flex sm:justify-center sm:max-w-none'>
              {user ? (
                <Link
                  to='/timelines'
                  className='flex justify-center items-center py-3 px-4 text-base font-medium text-yellow-700 bg-white hover:bg-yellow-50 rounded-md border border-transparent shadow-sm sm:px-8'
                >
                  View Timelines for {user.email}
                </Link>
              ) : (
                <div className='space-y-4 sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:mx-auto sm:space-y-0'>
                  <Link to='/join'>
                    <button className='btn btn-outline'>Sign up</button>
                  </Link>
                  <Link to='/login'>
                    <button className='btn btn-primary'>Log in</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
