import { Group, Text, ThemeIcon, UnstyledButton, useMantineTheme } from "@mantine/core";
import type { NavbarLinkProps } from "./navbar-link.types";

export function NavbarLink({ icon, color, label }: NavbarLinkProps): JSX.Element {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
    sx={(theme) => ({
      display: 'block',
      width: '100%',
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    })}
  >
    <Group>
      <ThemeIcon color={color} variant="light">
        {icon}
      </ThemeIcon>

      <Text size="sm">{label}</Text>
    </Group>
  </UnstyledButton>
  );
}