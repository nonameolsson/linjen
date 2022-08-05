import cx from 'classnames'

export function Content({
  children,
  className,
  paddingMobile,
  noPaddingDesktop,
  title
}: {
  children?: React.ReactNode
  className?: string
  paddingMobile?: boolean
  noPaddingDesktop?: boolean
  title: string
}): JSX.Element {
  const classNames = cx('grid grid-cols-12 gap-4 overflow-y-scroll h-full', {
    'lg:m-4': !noPaddingDesktop,
    'lg:m-0': noPaddingDesktop,
    'm-4': paddingMobile
  })

  return <main className={classNames}>{children}</main>
}
