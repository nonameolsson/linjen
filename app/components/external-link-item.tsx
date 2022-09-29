import { ActionIcon, Group, Menu, Text } from '@mantine/core'
import { useFetcher } from '@remix-run/react'
import {
  IconDotsVertical,
  IconLink,
  IconPencil,
  IconTrash
} from '@tabler/icons'

type ExternalLinkItemProps = {
  id: string
  title: string
  url: string
}

export function ExternalLinkItem(props: ExternalLinkItemProps): JSX.Element {
  const { id, title, url } = props
  const fetcher = useFetcher()

  const onClick = () => {
    fetcher.submit(
      { linkId: id },
      {
        method: 'post',
        action: `/externallink/${id}`,
        replace: true
      }
    )
  }

  return (
    <Group
      position='apart'
      sx={theme => ({
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.gray[0],

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[1],
          cursor: 'pointer'
        }
      })}
    >
      <Text
        component='a'
        href={url}
        target='_blank'
        style={{ flex: 1 }}
        px='md'
        py='xs'
      >
        <Group>
          <IconLink size={16} />
          <Text variant='text' size='md'>
            {title}
          </Text>
        </Group>
      </Text>

      <Menu shadow='md' position='bottom-end'>
        <Menu.Target>
          <ActionIcon variant='subtle' size='md' mr='md'>
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item disabled={true} icon={<IconPencil size={14} />}>
            Edit
          </Menu.Item>

          <Menu.Item
            color='red'
            onClick={onClick}
            icon={<IconTrash size={14} />}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
