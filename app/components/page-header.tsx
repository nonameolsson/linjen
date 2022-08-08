import { ArrowLeftIcon } from '@heroicons/react/outline'
import { useNavigate } from '@remix-run/react'

export interface PageHeaderProps {
  title: string
  description?: string
  descriptionExtra?: string
  actions?: JSX.Element
  goBackTo?: string
}

export function PageHeader(props: PageHeaderProps) {
  const { actions, description, descriptionExtra, goBackTo, title } = props
  const navigate = useNavigate()

  const goBack = () => {
    if (goBackTo) {
      navigate(goBackTo)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className='sticky z-10 top-0 bg-base-100 border-b border-l border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8'>
      <div className='flex-none'>
        <button onClick={goBack} className='btn btn-square btn-ghost mr-4'>
          <ArrowLeftIcon className='inline-block w-5 h-5' />
        </button>
      </div>
      <div className='flex-1 min-w-0'>
        <h1 className='text-lg font-medium leading-6 text-gray-900 sm:truncate'>
          {title}
        </h1>
        {description && (
          <p className='text-sm font-medium text-gray-500'>
            {description}{' '}
            {descriptionExtra && (
              <span className='text-gray-900'>{descriptionExtra}</span>
            )}
          </p>
        )}
      </div>

      {actions && (
        <div className='mt-4 flex sm:mt-0 sm:ml-4 space-x-4'>{actions}</div>
      )}
    </div>
  )
}
