import { Box, Tooltip, UnstyledButton } from '@mantine/core'
import { NavLink } from '@remix-run/react'

import { useStyles } from './navbar-link.styles'
import type { NavbarLinkProps } from './navbar-link.types'

export function NavbarLink(props: NavbarLinkProps): JSX.Element {
  const {
    color,
    target,
    collapsed = true,
    icon: Icon,
    title,
    tooltipLabel,
    ...rest
  } = props

  const { classes, cx } = useStyles({ color })

  if (collapsed) {
    if (typeof target === 'string') {
      return (
        <Tooltip label={tooltipLabel} position='right' transitionDuration={0}>
          <NavLink
            to={target}
            className={({ isActive }) =>
              cx(classes.link, { [classes.linkActive]: isActive })
            }
          >
            <Icon stroke={1.5} />
          </NavLink>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip label={tooltipLabel} position='right' transitionDuration={0}>
          <UnstyledButton<'button'>
            // onClick={target}
            type='submit'
            // className={cx(classes.link, { [classes.linkActive]: 'Timelines' })}
            className={classes.link}
          >
            <Icon stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      )
    }
  }

  if (typeof target === 'string') {
    console.log('hej')
    return (
      <NavLink
        to={target}
        className={({ isActive }) =>
          cx(classes.link, { [classes.linkActive]: isActive })
        }
        {...rest}
      >
        <Icon className={classes.linkIcon} stroke={1.5} />
        <span>{title}</span>
      </NavLink>
    )
  } else {
    return (
      <Box<'button'>
        type='submit'
        className={classes.link}
        onClick={target}
        {...rest}
      >
        <Icon className={classes.linkIcon} stroke={1.5} />
        <span>{title}</span>
      </Box>
    )
  }
}
