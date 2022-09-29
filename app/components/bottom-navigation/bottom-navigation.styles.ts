import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  footer: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
  },
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
