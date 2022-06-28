export function Content({
  children,
  actions,
  description,
  title
}: {
  children?: React.ReactNode
  actions?: JSX.Element
  description?: string
  title: string
}): JSX.Element {
  return (
    <main className='flex overflow-y-auto flex-1 p-4 h-full'>
      <section
        aria-labelledby='primary-heading'
        className='flex flex-col flex-1 min-w-0 h-full lg:order-last'
      >
        <h1 id='primary-heading' className='sr-only'>
          {title}
        </h1>

        <div className='flex justify-between'>
          <div className='flex flex-col'>
            <h3>{description}</h3>
          </div>
          <div className='flex items-start'>{actions}</div>
        </div>
        <div className='mt-4 h-full'>{children}</div>
      </section>
    </main>
  )
}
