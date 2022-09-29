type Data = {
  title: string
  id: string
}

type Path = {
  prefix: string
  suffix?: string
}

export type AsideWidgetProps = {
  title: string
  icon?: JSX.Element
  emptyDataTitle: string
  data: Data[]
  path: Path
}
