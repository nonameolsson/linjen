export interface ContentModuleProps {
  title: string
  children: React.ReactNode
}

export function ContentModule(props: ContentModuleProps) {
  const { children, title } = props

  return (
    <section aria-labelledby='applicant-information-title'>
      <div className='bg-white shadow sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h2
            id='applicant-information-title'
            className='text-lg font-medium leading-6 text-gray-900'
          >
            {title}
          </h2>
        </div>
        <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
          {children}
        </div>
      </div>
    </section>
  )
}
