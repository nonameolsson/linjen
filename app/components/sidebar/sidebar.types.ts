export type SidebarNavigationItem = {
  name: string
  to: string
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}
