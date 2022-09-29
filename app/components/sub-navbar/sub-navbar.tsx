import { Group, Title } from '@mantine/core'
import { NavLink } from '@remix-run/react'
import { useStyles } from './sub-navbar.styles'

export type SubLink = {
  label: string
  to: string
}

export type SubNavbarProps = {
  links: SubLink[]
  title: string
  buttons?: JSX.Element
}

export function SubNavbar(props: SubNavbarProps): JSX.Element {
  const { links, title, buttons } = props
  const { classes, cx } = useStyles()

  return (
    <div className={classes.main}>
      <Group position='apart' className={classes.header}>
        <Title order={4} className={classes.title}>
          {title}
        </Title>
        {buttons && <div>{buttons}</div>}
      </Group>

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
    </div>
  )
}
