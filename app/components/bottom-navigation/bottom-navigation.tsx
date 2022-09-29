import { Footer, Group, Stack, Text } from '@mantine/core'
import { useOs } from '@mantine/hooks'
import { NavLink } from '@remix-run/react'

import { useStyles } from './bottom-navigation.styles'

import type {
  BottomNavigationProps,
  IconProps
} from './bottom-navigation.types'

function NavigationIcon({ icon: Icon, to, title }: IconProps): JSX.Element {
  const { classes, cx } = useStyles()

  return (
    <NavLink to={to} className={classes.link}>
      {({ isActive }) => {
        return (
          <Stack align='center' spacing={0}>
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <Icon.type
              {...Icon.props}
              size={24}
              className={cx(classes.icon, { [classes.iconActive]: isActive })}
            />
            <Text
              size='xs'
              className={cx(classes.title, { [classes.titleActive]: isActive })}
            >
              {title}
            </Text>
          </Stack>
        )
      }}
    </NavLink>
  )
}

export function BottomNavigation(props: BottomNavigationProps): JSX.Element {
  const { children } = props
  const os = useOs()
  const { classes } = useStyles()

  return (
    <Footer
      height={60}
      // height={os === 'ios' ? 88 : 60}
      className={classes.footer}
    >
      <Group grow className={classes.icons}>
        {children}
      </Group>
    </Footer>
  )
}

BottomNavigation.Button = NavigationIcon
