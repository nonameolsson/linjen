export interface PageHeaderProps {
  title: string
  description?: string
  descriptionExtra?: string
  actions?: JSX.Element
}

export function PageHeader(props: PageHeaderProps) {
  const { actions, description, descriptionExtra, title } = props

  return (
    <div className="sticky z-10 top-0 border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
    <div className="flex-1 min-w-0">
      <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">Home</h1>
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

    <div className="mt-4 flex sm:mt-0 sm:ml-4">
      <button
        type="button"
        className="order-1 ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-0 sm:ml-0"
      >
        Share
      </button>
      <button
        type="button"
        className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3"
      >
        Create
      </button>
    </div>
  </div>
    // <div className='px-4 sticky shadow top-0 mb-6 justify-between hidden lg:flex '>
    //   <div className='flex-col flex-shrink-0'>
    //     <div className='relative'>
    //       <img
    //         className='h-16 w-16 rounded-full'
    //         src='https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
    //         alt=''
    //       />
    //       <span
    //         className='absolute inset-0 rounded-full shadow-inner'
    //         aria-hidden='true'
    //       />
    //     </div>
    //     <div className="relative">
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
    //     <div className='justify-stretch flex space-y-reverse justify-end space-y-0 space-x-3 space-x-reverse mt-0 flex-row'>
    //       {actions}
    //     </div>
    //   )}
    // </div>
  )
}
