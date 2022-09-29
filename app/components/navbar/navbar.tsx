import { Center, Navbar as MantineNavbar, Stack, Title } from '@mantine/core'
import {
  IconCalendarEvent,
  IconFriends,
  IconHourglassEmpty,
  IconMap,
  IconTimeline,
  IconUser
} from '@tabler/icons'
import { useState } from 'react'
import { NavbarIconLink } from '../navbar-icon-link'
import type { NavbarLinkProps } from '../navbar-link/'
import { useStyles } from './navbar.styles'
import type { NavbarProps } from './navbar.types'

const mainLinks: NavbarLinkProps[] = [
  {
    icon: IconTimeline,
    color: 'blue',
    title: 'Timelines',
    href: '/timelines',
    tooltipLabel: 'All timelines',
    id: 1
  },
  {
    icon: IconCalendarEvent,
    color: 'teal',
    title: 'Events',
    href: '/events',
    tooltipLabel: 'All events',
    id: 2
  },
  {
    icon: IconFriends,
    color: 'violet',
    title: 'People',
    href: '/people',
    tooltipLabel: 'All people',
    id: 3
  },
  {
    icon: IconMap,
    color: 'grape',
    title: 'Locations',
    href: '/locations',
    tooltipLabel: 'All locations',
    id: 4
  }
]

const userLinks: NavbarLinkProps[] = [
  {
    icon: IconUser,
    color: 'blue',
    title: 'Profile',
    href: '/profile',
    tooltipLabel: 'Profile',
    id: 1
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
  const { opened, logo, subNavigation } = props
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
      width={{ sm: 80 /*300*/ }}
      p='md'
    >
      <Center>
        {/*logo*/}
        <IconHourglassEmpty size={30} color='yellow' />
      </Center>
      <MantineNavbar.Section grow mt='50'>
        <Stack justify='center' spacing={0}>
          {mainLinks.map(link => (
            <NavbarIconLink
              title={link.title}
              color={link.color}
              href={link.href}
              iconOnly={true}
              icon={link.icon}
              tooltipLabel={link.tooltipLabel}
              key={link.title}
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
            <NavbarIconLink
              iconOnly
              key={link.id}
              color={link.color}
              href={link.href}
              icon={link.icon}
              tooltipLabel={link.tooltipLabel}
              title={link.title}
            />
          ))}
        </Stack>
      </MantineNavbar.Section>
    </MantineNavbar>
  )
}
