import {
  Burger,
  Header as MantineHeader,
  MediaQuery,
  Text,
  useMantineTheme
} from '@mantine/core'
import type { HeaderProps } from './header.types'

export function Header({ opened, setOpened, title }: HeaderProps): JSX.Element {
  const theme = useMantineTheme()

  return (
    <MantineHeader height={70} p='md'>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((open: boolean) => !open)}
            size='sm'
            color={theme.colors.gray[6]}
            mr='xl'
          />
        </MediaQuery>

        <Text>{title}</Text>
      </div>
    </MantineHeader>
  )
}
