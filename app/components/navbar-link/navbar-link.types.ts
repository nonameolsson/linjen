import type { DefaultProps } from '@mantine/core'
import type { TablerIcon } from '@tabler/icons'

export interface NavbarLinkProps extends DefaultProps {
  icon: TablerIcon
  color: string
  tooltipLabel: string
  collapsed?: boolean
  target: string | undefined
  title: string
}
