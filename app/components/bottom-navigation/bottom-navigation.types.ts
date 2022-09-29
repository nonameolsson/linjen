export type BottomNavigationProps = {
  children: React.ReactNode
}

export type StyleProps = {
  active: boolean
}

export type IconProps = {
  active?: boolean
  icon: JSX.Element
  to: string
  title?: string
}
