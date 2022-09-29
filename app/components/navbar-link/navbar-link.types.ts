import type { TablerIcon } from '@tabler/icons'

export type TLink = string
export type TFunction = () => void

export function isLink(handle: TLink | TFunction): handle is TLink {
  return typeof handle === 'string'
}

export interface NavbarLinkProps {
  icon: TablerIcon
  color: string
  handle: string | (() => void)
  tooltipLabel: string
  iconOnly?: boolean
  active?: boolean
  title: string
}
