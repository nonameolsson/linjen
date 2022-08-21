import { Button } from '@mantine/core'
import { Link } from '@remix-run/react'

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
  return link ? (
    <Button component={Link} to={link}>
      {icon}
    </Button>
  ) : (
    <div onClick={onClick}>{icon}</div>
  )
}
