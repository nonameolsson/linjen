import { Box, Navbar as MantineNavbar, Title } from '@mantine/core'
import { Form } from '@remix-run/react'
import {
  IconCalendarEvent,
  IconFriends,
  IconHome,
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
    target: '/timelines',
    tooltipLabel: 'All timelines'
  },
  {
    icon: IconCalendarEvent,
    color: 'teal',
    title: 'Events',
    target: '/events',
    tooltipLabel: 'All events'
  },
  {
    icon: IconFriends,
    color: 'lime',
    title: 'People',
    target: '/people',
    tooltipLabel: 'All people'
  },
  {
    icon: IconMap,
    color: 'grape',
    title: 'Locations',
    target: '/locations',
    tooltipLabel: 'All locations'
  }
]

const bottomLinks: NavbarLinkProps[] = [
  {
    icon: IconUser,
    color: 'gray',
    title: 'Profile',
    target: '/profile',
    tooltipLabel: 'Profile'
  }
]

export function Navbar(props: NavbarProps): JSX.Element {
  const {
    opened,
    collapsed,
    isMobile,
    subNavigation,
    subNavigationTitle,
    toggleCollapsed
  } = props
  const collapsedItems: boolean = isMobile ? false : !!collapsed
  const { classes } = useStyles({
    collapsed: collapsedItems
  })

  const renderLinks = (links: NavbarLinkProps[]): React.ReactNode => {
    return links.map(item => (
      <NavbarLink
        color={item.color}
        target={item.target}
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
      hiddenBreakpoint='sm'
      hidden={!opened}
      width={{
        sm: collapsedItems ? (subNavigation ? 300 : 60) : 300
      }}
      p={isMobile ? 'md' : undefined}
    >
      <MantineNavbar.Section grow className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            <IconHome type='mark' size={30} />
          </div>

          <MantineNavbar.Section
            grow
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              width: '100%',
              alignItems: 'center'
            }}
          >
            {renderLinks(mainLinks)}
          </MantineNavbar.Section>
          <MantineNavbar.Section
            grow
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              width: '100%',
              alignItems: 'center'
            }}
            pb='sm'
          >
            {renderLinks(bottomLinks)}

            <Box
              component={Form}
              action='/logout'
              method='post'
              sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <NavbarLink
                target={undefined}
                color='gray'
                icon={IconLogout}
                collapsed={collapsedItems}
                title='Log out'
                tooltipLabel='Log out'
                sx={{ flex: 1 }}
              />
            </Box>
          </MantineNavbar.Section>
        </div>

        {!isMobile && subNavigation && (
          <div className={classes.main}>
            <Title order={4} className={classes.title}>
              {subNavigationTitle}
            </Title>

            {subNavigation}
          </div>
        )}
      </MantineNavbar.Section>
    </MantineNavbar>
  )
}
