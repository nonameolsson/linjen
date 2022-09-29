import { createStyles } from '@mantine/core'
import type { FabStyleProps } from './fab.types'

export const useStyles = createStyles((theme, { offset }: FabStyleProps) => ({
  button: {
    backgroundColor: theme.colors.blue[6],
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.sm,
    color: theme.white,
    position: 'fixed',
    bottom: offset
      ? 'calc(env(safe-area-inset-bottom) + 4rem + 1rem)'
      : theme.spacing.md,
    right: theme.spacing.md,
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    zIndex: 100,
    width: '3rem',
    height: '3rem',
    display: 'flex',

    '&:hover': {
      backgroundColor: theme.colors.blue[7],
      boxShadow: theme.shadows.lg
    },

    '> div': {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
}))
