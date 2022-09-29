import { ActionIcon, Group, Paper, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons'

import { ExternalLinkItem } from '../external-link-item'
import type { Link, LinkListProps } from './link-list.types'

export function LinkList(props: LinkListProps) {
  const { items, onNewClick, title } = props

  return (
    <>
      <Group position='apart'>
        <Title ml='md' mt='md' mb='sm' order={3}>
          {title}
        </Title>
        <ActionIcon
          color='blue'
          radius='xl'
          variant='default'
          onClick={onNewClick}
          mr='md'
        >
          <IconPlus size={16} />
        </ActionIcon>
      </Group>

      <Paper>
        {items.map((item: Link) => (
          <ExternalLinkItem
            id={item.id}
            key={item.id}
            title={item.title}
            url={item.url}
          />
        ))}
      </Paper>
    </>
  )
}
