import { createStyles, UnstyledButton } from '@mantine/core'
import { Link } from '@remix-run/react'

const useStyles = createStyles(theme => ({
  button: {
    backgroundColor: theme.colors.blue[5],
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.sm,
    color: theme.white,
    padding: theme.spacing.lg,
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    zIndex: 100,
    width: '4rem',
    height: '4rem',

    '&:hover': {
      backgroundColor: theme.colors.blue[6],
      boxShadow: theme.shadows.md
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
  const { classes } = useStyles()

  return link ? (
    <UnstyledButton className={classes.button} component={Link} to={link}>
      {icon}
    </UnstyledButton>
  ) : (
    <div onClick={onClick}>{icon}</div>
  )
}
