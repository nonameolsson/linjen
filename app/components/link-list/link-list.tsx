import { Box, Text } from '@mantine/core'
import { ExternalLinkItem } from '../external-link-item'
import type { Link, LinkListProps } from './link-list.types'

export function LinkList(props: LinkListProps) {
  const { items } = props

  return items.length > 0 ? (
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
  ) : (
    <Box p='md'>
      <Text>No links added yet...</Text>
    </Box>
  )
}
