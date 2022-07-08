import { Link } from '@remix-run/react'
import classNames from 'classnames'

export function Fab({
  link,
  icon,
  offset
}: {
  link: string
  icon: JSX.Element
  offset: boolean
}) {
  const cx = classNames(
    'btn-xl btn btn-primary btn-circle fixed right-4 shadow-2xl drop-shadow-2xl',
    offset ? 'bottom-20 lg:bottom-4' : 'bottom-4'
  )

  return (
    <Link to={link} className={cx}>
      {icon}
    </Link>
  )
}
