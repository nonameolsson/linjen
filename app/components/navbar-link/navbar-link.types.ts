import type { DefaultProps } from '@mantine/core'
import type { TablerIcon } from '@tabler/icons'

export type TLink = string
export type TFunction = () => void

export function isLink(handle?: TLink | TFunction): handle is TLink {
  return typeof handle === 'string'
}

export interface NavbarLinkProps extends DefaultProps {
  children?: React.ReactNode
  icon: TablerIcon
  color: string
  to?: string
  tooltipLabel: string
  onClick?: () => void
  collapsed?: boolean
  title: string
}
