import cx from 'classnames'

export function Content({
  aside,
  children,
  className,
  paddingMobile,
  noPaddingDesktop = true,
  desktopNavbar,
  title
}: {
  children?: React.ReactNode
  aside?: JSX.Element
  desktopNavbar?: JSX.Element
  className?: string
  paddingMobile?: boolean
  noPaddingDesktop?: boolean
  title: string
}): JSX.Element {
  const classNames = cx({
    'col-span-12': !aside,
    'lg:col-span-12 xl:col-span-8': aside,
    'lg:m-4': !noPaddingDesktop,
    'lg:m-0': noPaddingDesktop,
    'm-4': paddingMobile
  })

  return (
    <>
      {desktopNavbar && (
        <div>
          {/* <div className='bg-white sticky shadow top-0 hidden py-4 lg:block lg:col-span-12 z-10 mb-6'> */}
          {desktopNavbar}
        </div>
      )}
      <div className='max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-y-0 lg:gap-8'>
        <main className={classNames}>{children}</main>
        {aside && (
          <aside className='hidden xl:block xl:col-span-4'>{aside}</aside>
        )}
      </div>
    </>
  )
}
