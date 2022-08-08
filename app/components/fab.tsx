import { Link } from '@remix-run/react'
import classNames from 'classnames'

export function Fab({
  link,
  icon,
  offset,
  onClick
}: {
  link?: string
  icon: JSX.Element
  offset: boolean
  onClick?: () => void
}) {
  const cx = classNames(
    'btn-xl btn btn-primary btn-circle fixed right-4 shadow-2xl drop-shadow-lg hover:drop-shadow-xl active:drp-shadow-2xl',
    offset ? 'bottom-20 lg:bottom-4' : 'bottom-4'
  )

  return link ? (
    <Link to={link} className={cx}>
      {icon}
    </Link>
  ) : (
    <div onClick={onClick} className={cx}>
      {icon}
    </div>
  )
}
