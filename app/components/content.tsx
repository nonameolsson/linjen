export function Content({
  children,
  title
}: {
  children?: React.ReactNode
  title: string
}): JSX.Element {
  return (
    <div className='flex flex-1 overflow-y-scroll'>
      <section aria-labelledby='primary-heading'>
        <h1 id='primary-heading' className='sr-only'>
          {title}
        </h1>
      </section>
      <main className='container mx-auto'>{children}</main>
    </div>
  )
}
