import { NavLink } from '@remix-run/react'
import { useStyles } from './sub-navbar.styles'

export type SubLink = {
  label: string
  to: string
}

export type SubNavbarProps = {
  links: SubLink[]
}

export function SubNavbar(props: SubNavbarProps): JSX.Element {
  const { links } = props
  const { classes, cx } = useStyles()

  return (
    <>
      {links.map(link => (
        <NavLink
          className={({ isActive }) =>
            cx(classes.link, { [classes.linkActive]: isActive })
          }
          to={link.to}
          key={link.to}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )
}
