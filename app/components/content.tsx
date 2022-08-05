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
  const classNames = cx(
    // 'gap-4 overflow-y-scroll h-full',
    'grid grid-cols-12 gap-4 overflow-y-scroll h-full',
    // 'grid h-full grid-cols-1 items-start gap-4 overflow-y-scroll lg:grid-cols-4 lg:gap-8',
    {
      'lg:m-4': !noPaddingDesktop,
      'lg:m-0': noPaddingDesktop,
      'm-4': paddingMobile
      // 'lg:p-0': noVerticalPaddingDesktop,
      // 'lg:px-8': !noVerticalPaddingDesktop,
      // 'py-4': noVerticalPaddingDesktop
    }
  )

  return <main className={classNames}>{children}</main>
}
