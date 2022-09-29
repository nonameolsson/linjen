import { createStyles, Drawer, Group } from '@mantine/core'
import { IconArrowBarLeft } from '@tabler/icons'
import { useState } from 'react'
import { Fab } from '../fab'

type AsideDrawerProps = {
  children: React.ReactNode
  fabOffset?: boolean
  title: string
}

export const useStyles = createStyles(theme => ({
  header: {
    padding: theme.spacing.md
  }
}))

export function AsideDrawer(props: AsideDrawerProps): JSX.Element {
  const { children, fabOffset = false, title } = props
  const { classes } = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        position='right'
        size='xl'
        classNames={{ header: classes.header }}
      >
        {children}
      </Drawer>

      <Group position='center'>
        <Fab
          offset={fabOffset}
          onClick={() => setIsOpen(true)}
          icon={<IconArrowBarLeft />}
        />
      </Group>
    </>
  )
}
