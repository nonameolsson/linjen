import { createStyles, UnstyledButton } from '@mantine/core'
import { IconDotsVertical } from '@tabler/icons'
import { forwardRef } from 'react'

type OverflowButtonProps = {
  icon?: JSX.Element
}

const useStyles = createStyles(theme => ({
  button: {
    borderRadius: theme.radius.xl,
    transitionDuration: '150ms',
    transitionProperty: 'background-color',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    flex: '1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,

    '&:hover': {
      backgroundColor: theme.colors.gray[1]
    }
  }
}))

export const OverflowButton = forwardRef<
  HTMLButtonElement,
  OverflowButtonProps
>(({ icon, ...others }: OverflowButtonProps, ref) => {
  const { classes } = useStyles()

  return (
    <UnstyledButton
      title='More'
      ref={ref}
      className={classes.button}
      {...others}
    >
      {icon || <IconDotsVertical />}
    </UnstyledButton>
  )
})

OverflowButton.displayName = 'OverflowButton'
