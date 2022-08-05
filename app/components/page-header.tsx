export interface PageHeaderProps {
  title: string
  description?: string
  descriptionExtra?: string
  actions?: JSX.Element
}

export function PageHeader(props: PageHeaderProps) {
  const { actions, description, descriptionExtra, title } = props

  return (
    <div className='mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8'>
      <div className='flex items-center space-x-5'>
        <div className='flex-shrink-0'>
          <div className='relative'>
            <img
              className='h-16 w-16 rounded-full'
              src='https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
              alt=''
            />
            <span
              className='absolute inset-0 rounded-full shadow-inner'
              aria-hidden='true'
            />
          </div>
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
          {description && (
            <p className='text-sm font-medium text-gray-500'>
              {description}{' '}
              {descriptionExtra && (
                <span className='text-gray-900'>{descriptionExtra}</span>
              )}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className='justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3'>
          {actions}
        </div>
      )}
    </div>
  )
}
