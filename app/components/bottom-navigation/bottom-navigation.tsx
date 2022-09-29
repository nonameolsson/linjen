import { Footer, Group, Stack, Text, Transition } from '@mantine/core'
import { NavLink } from '@remix-run/react'
import { useEffect, useState } from 'react'

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
  const [mounted, setMounted] = useState(false)
  const { classes } = useStyles()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Transition
      mounted={mounted}
      transition='slide-up'
      duration={400}
      timingFunction='ease'
    >
      {styles => (
        <Footer height={60} className={classes.footer} style={styles}>
          <Group grow className={classes.icons}>
            {children}
          </Group>
        </Footer>
      )}
    </Transition>
  )
}

BottomNavigation.Button = NavigationIcon
