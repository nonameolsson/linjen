import { AppShell, Box, Transition, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'

import { Aside, AsideDrawer, Fab, Header, Navbar } from '~/components'

import type { PageProps } from './page.types'

export function Page(props: PageProps): JSX.Element {
  const {
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actions,
    aside,
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

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
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
        aside={aside && <Aside title={aside.title}>{aside.component}</Aside>}
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
            collapsed={isCollapsed}
            toggleCollapsed={() => setIsCollapsed(!isCollapsed)}
            subNavigation={subNavigation}
            opened={opened}
          />
        }
      >
        {!isMobile && (
          <Box
            sx={{
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[7]
                  : theme.white,
              borderBottom: `1px solid ${
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[7]
                  : theme.colors.gray[3]
              }`,
              marginBottom: theme.spacing.xl,
              padding: theme.spacing.md,
              paddingTop: 18,
              height: 60
            }}
          />
        )}

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

      {isMobile && aside && (
        <AsideDrawer title={aside.title}>{aside.component}</AsideDrawer>
      )}
    </>
  )
}
