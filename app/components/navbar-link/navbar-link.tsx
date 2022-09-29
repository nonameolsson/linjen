import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core'
import { NavLink } from '@remix-run/react'
import type { NavbarLinkProps } from './navbar-link.types'

export function NavbarLink({
  icon: Icon,
  color,
  label,
  href
}: NavbarLinkProps): JSX.Element {
  return (
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

        <Text size='sm'>{label}</Text>
      </Group>
    </UnstyledButton>
  )
}
