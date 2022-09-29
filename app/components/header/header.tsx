import {
  Burger,
  Header as MantineHeader,
  Text,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { useNavigate } from '@remix-run/react'
import { IconArrowLeft } from '@tabler/icons'

import { useStyles } from './header.styles'
import type { HeaderProps } from './header.types'

const DEFAULT_DESKTOP_TITLE = 'LINJEN'

export function Header(props: HeaderProps): JSX.Element {
  const {
    goBackTo,
    opened,
    setOpened,
    desktopTitle,
    rightButtons,
    showBackButton,
    mobileTitle
  } = props
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const navigate = useNavigate()

  const goBack = () => {
    if (goBackTo) {
      navigate(goBackTo)
    } else {
      navigate(-1)
    }
  }

  return (
    <MantineHeader className={classes.header} height={44}>
      {showBackButton ? (
        <UnstyledButton onClick={goBack} className={classes.button}>
          <IconArrowLeft />
        </UnstyledButton>
      ) : (
        <Burger
          opened={opened}
          onClick={() => setOpened(o => !o)}
          size='sm'
          color={theme.colors.gray[6]}
          mr='xl'
          className={classes.button}
        />
      )}

      <Text className={classes.mobileTitle}>{mobileTitle}</Text>
      <Text className={classes.desktopTitle}>
        {desktopTitle || DEFAULT_DESKTOP_TITLE}
      </Text>
      <div className={classes.rightButtons}>{rightButtons && rightButtons}</div>
    </MantineHeader>
  )
}
