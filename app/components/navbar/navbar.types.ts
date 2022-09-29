export type NavbarProps = {
  opened: boolean
  logo: React.ReactNode
  collapsed?: boolean
  toggleCollapsed: () => void
  isMobile: boolean
  subNavigation?: React.ReactNode
  subNavigationTitle?: string
}
