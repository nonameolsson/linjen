import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  wrapper: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    paddingTop: 18,
    height: 60
  }
}))
