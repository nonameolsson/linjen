import type { MantineNumberSize, MantineTransition } from '@mantine/core'

export type PageProps = {
  actions?: JSX.Element
  aside?: {
    title: string
    component: JSX.Element
  }
  children: React.ReactNode
  fab?: {
    offset: boolean
    icon: JSX.Element
    to?: string
    onClick?: () => void
  }
  bottomNavigation?: JSX.Element
  goBackTo?: string
  header?: React.ReactNode
  padding?: MantineNumberSize
  showBackButton?: boolean
  subNavigation?: React.ReactNode
  transition?: MantineTransition
  title: string
  toolbarButtons?: JSX.Element
}
