import { createStyles, UnstyledButton } from '@mantine/core'
import { Link } from '@remix-run/react'

type FabStyleProps = {
  offset: boolean
}
const useStyles = createStyles((theme, { offset }: FabStyleProps) => ({
  button: {
    backgroundColor: theme.colors.blue[6],
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.sm,
    color: theme.white,
    position: 'fixed',
    bottom: offset ? '5rem' : theme.spacing.md,
    right: '16px',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    zIndex: 100,
    width: '3rem',
    height: '3rem',
    display: 'flex',

    transition: 'all 0.3s ease-in-out',

    '&:hover': {
      backgroundColor: theme.colors.blue[7],
      boxShadow: theme.shadows.lg,

      transform: 'scale(1.1)'
    },

    '> div': {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
}))

type FabProps = {
  link?: string
  icon: JSX.Element
  offset: boolean
  onClick?: () => void
}

export function Fab(props: FabProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { link, icon, offset, onClick } = props
  const { classes } = useStyles({ offset })

  return link ? (
    <UnstyledButton className={classes.button} component={Link} to={link}>
      <div>{icon}</div>
    </UnstyledButton>
  ) : (
    <div onClick={onClick}>{icon}</div>
  )
}
