import { Aside as MantineAside, MediaQuery, Text } from '@mantine/core'
import type { AsideProps } from './aside.types'

export function Aside({ children }: AsideProps): JSX.Element {
  return (
    <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
      <MantineAside p='md' hiddenBreakpoint='sm' width={{ sm: 200, lg: 300 }}>
        <Text>Application sidebar</Text>
        {children}
      </MantineAside>
    </MediaQuery>
  )
}
