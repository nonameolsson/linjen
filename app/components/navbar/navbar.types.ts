export type NavbarProps = {
  opened: boolean
  collapsed?: boolean
  toggleCollapsed: () => void
  isMobile: boolean
  subNavigation?: React.ReactNode
}
