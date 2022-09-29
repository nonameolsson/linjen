import { ChevronLeftIcon } from '@heroicons/react/solid'
import { useNavigate } from '@remix-run/react'

export function Navbar({
  className,
  showBackButton,
  rightButtons,
  goBackTo,
  title
}: {
  className?: string
  rightButtons?: JSX.Element
  goBackTo?: string
  showBackButton: boolean
  title: string
}): JSX.Element {
  const navigate = useNavigate()

  const goBack = () => {
    if (goBackTo) {
      navigate(goBackTo)
    } else {
      navigate(-1)
    }
  }

  return (
    <div>
      <div>
        {showBackButton ? (
          <button onClick={goBack}>
            <ChevronLeftIcon className='h-5 w-5' />
          </button>
        ) : (
          <label htmlFor='my-drawer'>
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
      <div className='navbar-center justify-center'>
        <div className='flex flex-col text-center'>
          <span className='text-xl normal-case'>{title}</span>
        </div>
      </div>
      <div className='navbar-end'>{rightButtons && rightButtons}</div>
    </div>
  )
}
