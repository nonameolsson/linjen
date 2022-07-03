import { ChevronLeftIcon } from '@heroicons/react/solid'
import { useNavigate } from '@remix-run/react'

export function Navbar({
  showBackButton,
  rightButtons,
  title
}: {
  rightButtons?: JSX.Element
  showBackButton: boolean
  title: string
}): JSX.Element {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  return (
    <div className='navbar w-screen bg-base-100 shadow lg:w-full'>
      <div className='navbar-start'>
        {showBackButton ? (
          <button onClick={goBack} className='btn btn-ghost btn-circle'>
            <ChevronLeftIcon className='h-5 w-5' />
          </button>
        ) : (
          <label
            className='btn btn-ghost btn-circle lg:hidden'
            htmlFor='my-drawer'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16M4 18h7'
              />
            </svg>
          </label>
        )}
      </div>
      <div className='navbar-center w-full justify-center'>
        <div className='flex flex-col text-center'>
          <span className='text-xl normal-case'>{title}</span>
        </div>
      </div>
      <div className='navbar-end'>{rightButtons && rightButtons}</div>
    </div>
  )
}
