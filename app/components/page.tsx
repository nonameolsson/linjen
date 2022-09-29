import type { MantineNumberSize, MantineTransition } from '@mantine/core'
import {
  AppShell,
  Aside,
  Box,
  createStyles,
  MediaQuery,
  Navbar,
  Title,
  Tooltip,
  Transition,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconCalendarEvent,
  IconFriends,
  IconMap,
  IconTimeline
} from '@tabler/icons'
import { useEffect, useState } from 'react'
import { Fab } from './fab'
import { Header } from './header'
import type { NavbarLinkProps } from './navbar-link'
import { NavbarUser } from './navbar-user'

const data: NavbarLinkProps[] = [
  {
    icon: IconTimeline,
    color: 'blue',
    label: 'Timelines',
    href: '/timelines',
    tooltip: 'All timelines'
  },
  {
    icon: IconCalendarEvent,
    color: 'teal',
    label: 'Events',
    href: '/events',
    tooltip: 'All events'
  },
  {
    icon: IconFriends,
    color: 'violet',
    label: 'People',
    href: '/people',
    tooltip: 'All people'
  },
  {
    icon: IconMap,
    color: 'grape',
    label: 'Locations',
    href: '/locations',
    tooltip: 'All locations'
  }
]

const useStyles = createStyles(theme => ({
  wrapper: {
    display: 'flex'
  },

  aside: {
    flex: '0 0 60px',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`
  },

  main: {
    flex: 1,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
  },

  mainLink: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[0]
    }
  },

  mainLinkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color
    }
  },

  title: {
    boxSizing: 'border-box',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.md,
    paddingTop: 18,
    height: 60,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`
  },

  logo: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: 60,
    paddingTop: theme.spacing.md,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    marginBottom: theme.spacing.xl
  },

  link: {
    boxSizing: 'border-box',
    display: 'block',
    textDecoration: 'none',
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `0 ${theme.spacing.md}px`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    fontWeight: 500,
    height: 44,
    lineHeight: '44px',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  linkActive: {
    '&, &:hover': {
      borderLeftColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor
      }).background,
      backgroundColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor
      }).background,
      color: theme.white
    }
  }
}))

export function MainLinks() {
  const { classes, cx } = useStyles()

  const links = data.map(link => (
    // <NavbarLink key={link.label} {...link} />
    <Tooltip
      label={link.tooltip}
      position='right'
      withArrow
      transitionDuration={0}
      key={link.label}
    >
      <UnstyledButton
        // onClick={() => setActive(link.label)}
        className={cx(classes.mainLink, {
          // [classes.mainLinkActive]: link.label === active
        })}
      >
        <link.icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ))

  return <div>{links}</div>
}

type PageProps = {
  actions?: JSX.Element
  aside?: JSX.Element
  children: React.ReactNode
  fab?: {
    offset: boolean
    icon: JSX.Element
    to?: string
    onClick?: () => void
  }
  bottomNavigation?: JSX.Element
  goBackTo?: string
  header?: React.ReactNode
  padding?: MantineNumberSize
  showBackButton?: boolean
  subNavigation?: React.ReactNode
  transition?: MantineTransition
  title: string
  toolbarButtons?: JSX.Element
}

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

export function Page(props: PageProps): JSX.Element {
  const {
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actions,
    aside,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bottomNavigation,
    fab,
    goBackTo,
    header,
    padding,
    showBackButton = false,
    subNavigation,
    title,
    toolbarButtons,
    transition = 'fade'
  } = props
  const theme = useMantineTheme()
  const { classes, cx } = useStyles()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const [opened, setOpened] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState('Releases')
  const [activeLink, setActiveLink] = useState('Settings')

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <AppShell
      padding={padding}
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0]
        }
      }}
      asideOffsetBreakpoint='sm'
      aside={
        aside && (
          <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
            <Aside p='md' hiddenBreakpoint='sm' width={{ sm: 200, lg: 300 }}>
              {aside}
            </Aside>
          </MediaQuery>
        )
      }
      footer={mobile ? bottomNavigation : undefined}
      header={
        <div>
          <Header
            mobileTitle={title}
            opened={opened}
            setOpened={setOpened}
            goBackTo={goBackTo}
            showBackButton={showBackButton}
            rightButtons={toolbarButtons}
          />
          {header}
        </div>
      }
      navbarOffsetBreakpoint='sm'
      navbar={
        <Navbar hiddenBreakpoint='sm' hidden={!opened} width={{ sm: 300 }}>
          <Navbar.Section grow className={classes.wrapper}>
            <div className={classes.aside}>
              <div className={classes.logo}>L.app</div>
              <MainLinks />
            </div>
            <div className={classes.main}>
              <Title order={4} className={classes.title}>
                {active}
              </Title>

              {subNavigation}
            </div>
          </Navbar.Section>

          <Navbar.Section>
            <NavbarUser />
          </Navbar.Section>
        </Navbar>
      }
    >
      {fab && (
        <Fab
          onClick={fab.onClick}
          offset={fab.offset}
          link={fab.to}
          icon={fab.icon}
        />
      )}
      <Transition
        mounted={mounted}
        transition={transition || 'fade'}
        duration={400}
        timingFunction='ease'
      >
        {styles => <Box style={styles}>{children}</Box>}
      </Transition>
    </AppShell>
  )
}
