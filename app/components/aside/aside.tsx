import { Aside as MantineAside, Box, MediaQuery, Title } from '@mantine/core'
import { useStyles } from './aside.styles'
import type { AsideProps } from './aside.types'

export function Aside(props: AsideProps): JSX.Element {
  const { children, title } = props
  const { classes } = useStyles()

  return (
    <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
      <MantineAside hiddenBreakpoint='sm' width={{ sm: 200, lg: 300 }}>
        <Box className={classes.wrapper}>
          <Title order={3}>{title}</Title>
        </Box>
        {children}
      </MantineAside>
    </MediaQuery>
  )
}
