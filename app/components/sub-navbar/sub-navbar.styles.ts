import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => {
  return {
    main: {
      flex: 1,
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
    },

    header: {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[3]
      }`,
      marginBottom: theme.spacing.xl,
      padding: theme.spacing.md,
      paddingTop: 18,
      height: 60
    },

    title: {
      boxSizing: 'border-box',
      fontFamily: `Greycliff CF, ${theme.fontFamily}`
    },

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
      // padding: `0 ${theme.spacing.md}px`,
      fontSize: theme.fontSizes.xl,
      marginRight: theme.spacing.md,
      fontWeight: 500,
      alignSelf: 'normal',
      // height: 44,
      // lineHeight: '44px',

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
