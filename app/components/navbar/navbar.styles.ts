import { createStyles } from '@mantine/core'

type NavbarStyleProps = {
  collapsed: boolean
}

export const useStyles = createStyles((theme, props: NavbarStyleProps) => {
  const { collapsed } = props

  return {
    wrapper: {
      display: 'flex'
    },

    aside: {
      flex: collapsed ? '0 0 60px' : 1,
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

      borderRight: collapsed
        ? `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[7]
              : theme.colors.gray[3]
          }`
        : 'none'
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: collapsed
        ? `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`
        : undefined
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`
    },

    logo: {
      boxSizing: 'border-box',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      height: 60,
      paddingTop: theme.spacing.md,
      borderBottom: collapsed
        ? `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[7]
              : theme.colors.gray[3]
          }`
        : undefined,
      marginBottom: theme.spacing.md
    }
  }
})
