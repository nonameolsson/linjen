import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  active: {
    color: theme.primaryColor
  },
  inactive: {
    color: theme.colors.gray[5]
  },
  link: {
    textDecoration: 'none'
  }
}))
