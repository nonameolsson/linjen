import type { MantineNumberSize, MantineTransition } from '@mantine/core'
import {
  AppShell,
  Aside,
  Box,
  MediaQuery,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconHourglassEmpty } from '@tabler/icons'
import { useEffect, useState } from 'react'

import { Fab } from './fab'
import { Header } from './header'
import { Navbar } from './navbar'

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
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const [opened, setOpened] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [mounted, setMounted] = useState(false)
  const herp = isMobile ? false : isCollapsed

  useEffect(() => {
    setMounted(true)
  }, [])

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
      footer={isMobile ? bottomNavigation : undefined}
      header={
        isMobile ? (
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
        ) : undefined
      }
      navbarOffsetBreakpoint='sm'
      navbar={
        <Navbar
          isMobile={isMobile}
          collapsed={herp}
          toggleCollapsed={() => setIsCollapsed(!isCollapsed)}
          subNavigation={subNavigation}
          logo={<IconHourglassEmpty size={30} color='yellow' />}
          opened={opened}
        />
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
