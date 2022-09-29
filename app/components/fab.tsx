import { createStyles, UnstyledButton } from '@mantine/core'
import { Link } from '@remix-run/react'

type FabStyleProps = {
  offset: boolean
}
const useStyles = createStyles((theme, { offset }: FabStyleProps) => ({
  button: {
    backgroundColor: theme.colors.blue[5],
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.sm,
    color: theme.white,
    padding: theme.spacing.lg,
    position: 'fixed',
    bottom: offset ? theme.spacing.xl : '16px',
    right: '16px',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    zIndex: 100,
    width: '3rem',
    height: '3rem',

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
  const { classes } = useStyles({ offset })

  return link ? (
    <UnstyledButton className={classes.button} component={Link} to={link}>
      {icon}
    </UnstyledButton>
  ) : (
    <div onClick={onClick}>{icon}</div>
  )
}
