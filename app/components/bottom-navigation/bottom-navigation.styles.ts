import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  footer: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    marginBottom: 'env(safe-area-inset-bottom, 50px)'
  },
  icons: {
    height: '100%'
  },
  icon: {
    color: theme.colors.gray[5]
  },
  iconActive: {
    color: theme.colors.blue[7]
  },
  title: {
    color: theme.colors.gray[5]
  },
  titleActive: {
    color: theme.colors.blue[7]
  },
  link: {
    textDecoration: 'none'
  }
}))
