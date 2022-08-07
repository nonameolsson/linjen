export interface PageHeaderProps {
  title: string
  description?: string
  descriptionExtra?: string
  actions?: JSX.Element
}

export function PageHeader(props: PageHeaderProps) {
  const { actions, description, descriptionExtra, title } = props

  return (
    <div className='sticky top-0 navbar bg-base-100 mb-6 hidden lg:flex'>
      <div className='flex-1'>
        <a className='btn btn-ghost normal-case text-xl'></a>
      </div>
      <div className='flex-none'>
        {actions && (
          <div className='justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3'>
            {actions}
          </div>
        )}
        <button className='btn btn-square btn-ghost'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block w-5 h-5 stroke-current'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
            ></path>
          </svg>
        </button>
      </div>
    </div>
    // <div className='mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8'>
    //   <div className='flex items-center space-x-5'>
    //     <div className='flex-shrink-0'>
    //       <div className='relative'>
    //         <img
    //           className='h-16 w-16 rounded-full'
    //           src='https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
    //           alt=''
    //         />
    //         <span
    //           className='absolute inset-0 rounded-full shadow-inner'
    //           aria-hidden='true'
    //         />
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
    //       {description && (
    //         <p className='text-sm font-medium text-gray-500'>
    //           {description}{' '}
    //           {descriptionExtra && (
    //             <span className='text-gray-900'>{descriptionExtra}</span>
    //           )}
    //         </p>
    //       )}
    //     </div>
    //   </div>
    //   {actions && (
    //     <div className='justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3'>
    //       {actions}
    //     </div>
    //   )}
    // </div>
  )
}
