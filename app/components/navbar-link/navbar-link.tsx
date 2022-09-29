import { Group, Text, ThemeIcon, Tooltip, UnstyledButton } from '@mantine/core'
import { NavLink } from '@remix-run/react'
import { useStyles } from './navbar-link.styles'
import type { NavbarLinkProps } from './navbar-link.types'
import { isLink } from './navbar-link.types'

export function NavbarLink(props: NavbarLinkProps) {
  const {
    active,
    color,
    handle,
    iconOnly = true,
    icon: Icon,
    title,
    tooltipLabel
  } = props
  const { classes, cx } = useStyles()

  let extraProps = {}

  if (isLink(handle)) {
    extraProps = {
      component: NavLink,
      to: handle
    }
  } else {
    extraProps = {
      onClick: handle
    }
  }

  return iconOnly ? (
    <Tooltip label={tooltipLabel} position='right' transitionDuration={0}>
      <UnstyledButton
        className={cx(classes.link, { [classes.active]: active })}
        {...extraProps}
      >
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ) : (
    <UnstyledButton
      sx={theme => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0]
        }
      })}
      {...extraProps}
    >
      <Group>
        <ThemeIcon color={color} variant='light'>
          <Icon />
        </ThemeIcon>

        <Text size='sm'>{title}</Text>
      </Group>
    </UnstyledButton>
  )
}
