import cx from 'classnames'
import { SlideOver } from './slide-over'

export function Content({
  aside,
  children,
  paddingMobile = false,
  noPaddingDesktop = true,
  desktopNavbar
}: {
  children?: React.ReactNode
  aside?: JSX.Element
  desktopNavbar?: JSX.Element
  className?: string
  paddingMobile?: boolean
  noPaddingDesktop?: boolean
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
      <div className='hidden lg:block lg:col-span-12 z-10 sticky top-0'>
        {desktopNavbar}
      </div>
      <div className='max-w-3xl sm:px-6 mt-4 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-y-0 lg:gap-8'>
        <main className={classNames}>{children}</main>
        {aside && (
          <aside className='hidden xl:block xl:col-span-4'>{aside}</aside>
        )}
        {aside && <SlideOver title='Related information'>{aside}</SlideOver>}
      </div>
    </>
  )
}
