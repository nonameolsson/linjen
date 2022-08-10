export interface Link {
  icon?: JSX.Element
  id: string
  title: string
  url: string
}

export interface LinkListProps {
  items: Link[]
  onNewClick: () => void
  title?: string
}
