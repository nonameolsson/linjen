import {
  Center,
  Navbar as MantineNavbar,
  Stack,
  Text,
  Title
} from '@mantine/core'
import {
  IconArrowAutofitLeft,
  IconArrowAutofitRight,
  IconCalendarEvent,
  IconFriends,
  IconMap,
  IconTimeline,
  IconUser
} from '@tabler/icons'
import { useState } from 'react'

import { NavbarLink } from '../navbar-link'
import type { NavbarLinkProps } from '../navbar-link/'
import { useStyles } from './navbar.styles'
import type { NavbarProps } from './navbar.types'

const mainLinks: NavbarLinkProps[] = [
  {
    icon: IconTimeline,
    color: 'blue',
    title: 'Timelines',
    handle: '/timelines',
    tooltipLabel: 'All timelines'
  },
  {
    icon: IconCalendarEvent,
    color: 'teal',
    title: 'Events',
    handle: '/events',
    tooltipLabel: 'All events'
  },
  {
    icon: IconFriends,
    color: 'violet',
    title: 'People',
    handle: '/people',
    tooltipLabel: 'All people'
  },
  {
    icon: IconMap,
    color: 'grape',
    title: 'Locations',
    handle: '/locations',
    tooltipLabel: 'All locations'
  }
]

const userLinks: NavbarLinkProps[] = [
  {
    icon: IconUser,
    color: 'blue',
    title: 'Profile',
    handle: '/profile',
    tooltipLabel: 'Profile'
  }
]

const linksMockdata = [
  'Security',
  'Settings',
  'Dashboard',
  'Releases',
  'Account',
  'Orders',
  'Clients',
  'Databases',
  'Pull Requests',
  'Open Issues',
  'Wiki pages'
]

export function Navbar(props: NavbarProps): JSX.Element {
  const { opened, logo, collapsed, subNavigation, toggleCollapsed } = props
  const { classes, cx } = useStyles()
  const [active, setActive] = useState('Releases')
  const [activeLink, setActiveLink] = useState('Settings')

  const links = linksMockdata.map(link => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: activeLink === link
      })}
      href='/'
      onClick={event => {
        event.preventDefault()
        setActiveLink(link)
      }}
      key={link}
    >
      {link}
    </a>
  ))

  return (
    <MantineNavbar
      hiddenBreakpoint='sm'
      hidden={!opened}
      width={{ sm: collapsed ? 80 : 300 }}
      p='md'
    >
      <Center>
        {logo} {!collapsed && <Text>Linjen</Text>}
      </Center>
      <MantineNavbar.Section grow mt={50}>
        <Stack justify='center' spacing={0}>
          {mainLinks.map(link => (
            <NavbarLink
              color={link.color}
              handle={link.handle}
              icon={link.icon}
              iconOnly={collapsed}
              key={link.title}
              title={link.title}
              tooltipLabel={link.tooltipLabel}
            />
          ))}
        </Stack>

        {subNavigation && (
          <div className={classes.main}>
            <Title order={4} className={classes.title}>
              {active}
            </Title>

            {subNavigation}
          </div>
        )}
      </MantineNavbar.Section>

      <MantineNavbar.Section>
        <Stack justify='center' spacing={0}>
          {userLinks.map(link => (
            <NavbarLink
              color={link.color}
              handle={link.handle}
              icon={link.icon}
              iconOnly={collapsed}
              key={link.title}
              title={link.title}
              tooltipLabel={link.tooltipLabel}
            />
          ))}
          <NavbarLink
            color='blue'
            handle={toggleCollapsed}
            icon={collapsed ? IconArrowAutofitRight : IconArrowAutofitLeft}
            iconOnly={collapsed}
            title={collapsed ? 'Expand' : 'Collapse'}
            tooltipLabel={collapsed ? 'Expand' : 'Collapse'}
          />
        </Stack>
      </MantineNavbar.Section>
    </MantineNavbar>
  )
}
