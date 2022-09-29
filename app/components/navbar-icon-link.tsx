import {
  createStyles,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton
} from '@mantine/core'
import { NavLink } from '@remix-run/react'
import type { TablerIcon } from '@tabler/icons'

const useStyles = createStyles(theme => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[0]
    }
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color
    }
  }
}))

interface NavbarLinkProps {
  icon: TablerIcon
  color: string
  href: string
  tooltipLabel: string
  iconOnly: boolean
  active?: boolean
  title: string
  onClick?(): void
}

export function NavbarIconLink(props: NavbarLinkProps) {
  const {
    active,
    color,
    href,
    iconOnly,
    icon: Icon,
    onClick,
    title,
    tooltipLabel
  } = props
  const { classes, cx } = useStyles()

  return iconOnly ? (
    <Tooltip label={tooltipLabel} position='right' transitionDuration={0}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ) : (
    <UnstyledButton
      component={NavLink}
      to={href}
      sx={theme => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0]
        }
      })}
    >
      <Group>
        <ThemeIcon color={color} variant='light'>
          <Icon />
        </ThemeIcon>

        <Text size='sm'>{title}</Text>
      </Group>
    </UnstyledButton>
  )
}
