import type { DefaultMantineColor } from '@mantine/core'
import { createStyles } from '@mantine/core'

type StyleProps = {
  color: DefaultMantineColor
  collapsed: boolean
}

export const useStyles = createStyles((theme, props: StyleProps, getRef) => {
  const icon = getRef('icon')
  const { color, collapsed } = props

  return {
    link: {
      ...theme.fn.focusStyles(),

      width: collapsed ? 44 : '100%',
      height: 44,
      borderRadius: theme.radius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      color:
        theme.colorScheme === 'dark'
          ? theme.colors[color][1]
          : theme.colors.gray[7],
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.variant({
                variant: 'default',
                color: theme.colors[color][theme.fn.primaryShade()]
              }).background
            : theme.colors[color][0],
        color:
          theme.colorScheme === 'dark'
            ? theme.colors[color][0]
            : theme.colors[color][9],

        [`& .${icon}`]: {
          color:
            theme.colorScheme === 'dark'
              ? theme.colors[color][0]
              : theme.colors[color][9]
        }
      }
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors[color][2]
          : theme.colors[color][7],
      marginRight: theme.spacing.sm
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors[color][0],
        color: theme.colorScheme
          ? theme.colors[color][6]
          : theme.colors[color][7],
        [`& .${icon}`]: {
          color:
            theme.colorScheme === 'dark'
              ? theme.colors[color][6]
              : theme.colors[color][7]
        }
      }
    }
  }
})
