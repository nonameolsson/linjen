import {
  ActionIcon,
  Avatar,
  Button,
  Paper,
  Text,
  useMantineColorScheme
} from '@mantine/core'
import { Form } from '@remix-run/react'
import { IconMoonStars, IconSun } from '@tabler/icons'
import { Page } from '~/components/page'
import { useUser } from '~/utils'

const pageTitle = 'Profile'

export default function NotesPage() {
  const user = useUser()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <Page title={pageTitle}>
      <Paper
        radius='md'
        withBorder
        p='lg'
        sx={theme => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
        })}
      >
        <ActionIcon
          variant='outline'
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title='Toggle color scheme'
        >
          {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
        <Avatar
          src='https://joeschmoe.io/api/v1/asdfjdk'
          size={120}
          radius={120}
          mx='auto'
        />
        <Text align='center' size='lg' weight={500} mt='md'>
          {user.id}
        </Text>
        <Text align='center' color='dimmed' size='sm'>
          {user.email}
        </Text>

        <Button variant='default' fullWidth mt='md'>
          Send message
        </Button>
      </Paper>

      <Form action='/logout' method='post'>
        <Button mt='xl' fullWidth type='submit'>
          Log out
        </Button>
      </Form>
    </Page>
  )
}
