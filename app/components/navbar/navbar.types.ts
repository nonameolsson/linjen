export type NavbarProps = {
  opened: boolean
  logo: React.ReactNode
  subNavigation?: React.ReactNode
  collapsed?: boolean
  toggleCollapsed: () => void
  isMobile: boolean
}
