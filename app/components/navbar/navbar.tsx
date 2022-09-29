import { Box, Code, Group, Navbar as MantineNavbar } from '@mantine/core'
import { Form } from '@remix-run/react'
import {
  IconCalendarEvent,
  IconFriends,
  IconLogout,
  IconMap,
  IconTimeline,
  IconUser
} from '@tabler/icons'

import type { NavbarLinkProps } from '../navbar-link/'
import { NavbarLink } from '../navbar-link/'
import { useStyles } from './navbar.styles'
import type { NavbarProps } from './navbar.types'

const mainLinks: NavbarLinkProps[] = [
  {
    icon: IconTimeline,
    color: 'blue',
    title: 'Timelines',
    to: '/timelines',
    tooltipLabel: 'All timelines'
  },
  {
    icon: IconCalendarEvent,
    color: 'teal',
    title: 'Events',
    to: '/events',
    tooltipLabel: 'All events'
  },
  {
    icon: IconFriends,
    color: 'violet',
    title: 'People',
    to: '/people',
    tooltipLabel: 'All people'
  },
  {
    icon: IconMap,
    color: 'grape',
    title: 'Locations',
    to: '/locations',
    tooltipLabel: 'All locations'
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
const bottomLinks: NavbarLinkProps[] = [
  {
    icon: IconUser,
    color: 'blue',
    title: 'Profile',
    to: '/profile',
    tooltipLabel: 'Profile'
  }
]

export function Navbar(props: NavbarProps): JSX.Element {
  const { opened, logo, collapsed, isMobile, subNavigation, toggleCollapsed } =
    props
  const { classes } = useStyles()

  const collapsedItems = isMobile ? false : collapsed

  const renderLinks = (links: NavbarLinkProps[]): React.ReactNode => {
    return links.map(item => (
      <NavbarLink
        color={item.color}
        to={item.to}
        icon={item.icon}
        collapsed={collapsedItems}
        key={item.title}
        title={item.title}
        tooltipLabel={item.tooltipLabel}
      />
    ))
  }

  return (
    <MantineNavbar
      // width={{
      //   sm: collapsed ? 80 : 300
      //   // subNavigation
      //   //   ? collapsed : 220
      //   //     ? 100
      //   //     : 100
      // }}
      hiddenBreakpoint='sm'
      hidden={!opened}
      width={{ sm: collapsedItems ? 80 : 300 }}
      p='md'
    >
      <MantineNavbar.Section grow>
        <Group className={classes.header} position='apart'>
          LOGO
          <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
        </Group>

        {renderLinks(mainLinks)}
      </MantineNavbar.Section>

      <MantineNavbar.Section className={classes.footer}>
        {renderLinks(bottomLinks)}

        <Box
          component={Form}
          action='/logout'
          method='post'
          sx={{ display: 'flex ' }}
        >
          <NavbarLink
            component='button'
            type='submit'
            color='blue'
            icon={IconLogout}
            collapsed={collapsedItems}
            title='Log out'
            tooltipLabel='Log out'
            sx={{ flex: 1 }}
          />
        </Box>
      </MantineNavbar.Section>

      {/* {!isMobile && subNavigation && (
          <div className={classes.main}>
            <Title order={4} className={classes.title}>
              {active}
            </Title>

            {subNavigation}
          </div>
        )}
      </MantineNavbar.Section> */}
    </MantineNavbar>
  )
}
