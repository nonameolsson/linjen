import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  button: {
    zIndex: 1,
    height: '100%',
    alignItems: 'center',
    marginLeft: '1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  mobileTitle: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'fixed',
    width: '100%',

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      display: 'none'
    }
  },
  desktopTitle: {
    display: 'none',

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      display: 'flex',
      alignSelf: 'center'
    }
  },
  menuButton: {
    alignItems: 'center',
    height: '100%',
    marginLeft: '1rem',
    zIndex: 1,

    [`@media (min-width: ${theme.breakpoints.sm})px`]: {
      display: 'none'
    }
  },
  rightButtons: {
    alignItems: 'center',
    alignSelf: 'end',
    display: 'flex',
    height: '100%',
    marginRight: theme.spacing.md
  }
}))
