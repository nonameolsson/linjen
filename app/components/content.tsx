import { Navbar } from './navbar'

export function Content({
  children,
  actions,
  description,
  setMobileMenuOpen,
  title
}: {
  children?: React.ReactNode
  actions?: JSX.Element
  description?: string
  setMobileMenuOpen: (open: boolean) => void
  title: string
}): JSX.Element {
  return (
    <div className='flex overflow-hidden flex-col flex-1'>
      <Navbar setMobileMenuOpen={setMobileMenuOpen} title={title} />

      {/* Main content */}
      <div className='flex overflow-hidden flex-1 items-stretch'>
        <main className='overflow-y-auto flex-1 p-4'>
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
            <div className='mt-4'>{children}</div>
          </section>
        </main>
      </div>
    </div>
  )
}
