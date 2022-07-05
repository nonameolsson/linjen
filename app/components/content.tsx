export function Content({
  children,
  actions,
  title
}: {
  children?: React.ReactNode
  actions?: JSX.Element
  title: string
}): JSX.Element {
  return (
    <main className='grid h-full grid-cols-1 items-start gap-4 overflow-y-scroll lg:grid-cols-4 lg:gap-8'>
      <section
        aria-labelledby='primary-heading'
        className='col-span-4 col-start-1 lg:col-span-2 lg:col-start-2'
      >
        <h1 id='primary-heading' className='sr-only'>
          {title}
        </h1>

        <div className='flex justify-between'>
          <div className='flex items-start'>{actions}</div>
        </div>
        <div className='h-full'>{children}</div>
      </section>
    </main>
  )
}
