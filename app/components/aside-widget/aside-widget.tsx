import { Box, Group, NavLink, Title } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconChevronRight } from '@tabler/icons'

import { useStyles } from './aside-widget.styles'
import type { AsideWidgetProps } from './aside-widget.types'

export function AsideWidget(props: AsideWidgetProps): JSX.Element {
  const { data, emptyDataTitle, icon, path, title } = props
  const { classes } = useStyles()

  return (
    <Box mb='xl'>
      <Group mb='md' mx='md'>
        {icon}
        <Title order={4}>{title}</Title>
      </Group>
      {data.length > 0 ? (
        data.map(item => (
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          <NavLink
            classNames={{
              root: classes.root
            }}
            component={Link}
            to={`/${path.prefix}/${item.id}/${path.suffix}`}
            label={item.title}
            key={item.id}
            rightSection={<IconChevronRight size={12} stroke={1.5} />}
          />
        ))
      ) : (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <NavLink
          classNames={{
            root: classes.root
          }}
          label={emptyDataTitle}
        />
      )}
    </Box>
  )
}
