import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => {
  return {
    link: {
      boxSizing: 'border-box',
      display: 'block',
      textDecoration: 'none',
      borderTopRightRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
      padding: `0 ${theme.spacing.md}px`,
      fontSize: theme.fontSizes.sm,
      marginRight: theme.spacing.md,
      fontWeight: 500,
      height: 44,
      lineHeight: '44px',

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.gray[1],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black
      }
    },

    linkActive: {
      '&, &:hover': {
        borderLeftColor: theme.fn.variant({
          variant: 'filled',
          color: theme.primaryColor
        }).background,
        backgroundColor: theme.fn.variant({
          variant: 'filled',
          color: theme.primaryColor
        }).background,
        color: theme.white
      }
    }
  }
})
