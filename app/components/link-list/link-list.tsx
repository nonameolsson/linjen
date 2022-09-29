import { ExternalLinkItem } from '../external-link-item'
import type { Link, LinkListProps } from './link-list.types'

export function LinkList(props: LinkListProps) {
  return (
    <>
      {props.items.map((item: Link) => (
        <ExternalLinkItem
          id={item.id}
          key={item.id}
          title={item.title}
          url={item.url}
        />
      ))}
    </>
  )
}
