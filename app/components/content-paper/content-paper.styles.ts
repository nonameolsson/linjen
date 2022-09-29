import { createStyles } from '@mantine/core'

export interface ContentPaperStylesParams {}

export default createStyles((theme, props: ContentPaperStylesParams) => ({
  root: {},
  container: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    boxShadow: theme.shadows.xs,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md
  },
  titleOutside: {},
  headerWrapper: {
    marginBottom: theme.spacing.md
  },
  titleInside: {},
  description: {},
  content: {
    paddingTop: theme.spacing.md
  }
}))
