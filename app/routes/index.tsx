import {
  BackgroundImage,
  Box,
  Button,
  Center,
  Group,
  Overlay,
  Text,
  Title
} from '@mantine/core'
import { Link } from '@remix-run/react'
import { useOptionalUser } from '~/utils'

export default function Index() {
  const user = useOptionalUser()

  return (
    <BackgroundImage
      src='images/landing.jpg'
      sx={{ display: 'flex', width: '100vw', height: '100vh' }}
    >
      <Center
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%'
        }}
      >
        <Overlay zIndex={0} blur={3} />
        <Box sx={{ zIndex: 100 }}>
          <Title sx={{ fontSize: '8rem' }} align='center' order={1}>
            Linjen
          </Title>
          <Text sx={{ fontSize: '2rem' }} align='center'>
            Create and visualize your own timelines.
          </Text>
          {user ? (
            <Link
              to='/timelines'
              className='flex justify-center items-center py-3 px-4 text-base font-medium text-yellow-700 bg-white hover:bg-yellow-50 rounded-md border border-transparent shadow-sm sm:px-8'
            >
              View Timelines for {user.email}
            </Link>
          ) : (
            <Group position='center' mt='xl'>
              <Button variant='outline' component={Link} size='xl' to='/join'>
                Sign up
              </Button>
              <Button
                variant='filled'
                color='blue'
                size='xl'
                component={Link}
                to='/login'
              >
                Log in
              </Button>
            </Group>
          )}
        </Box>
      </Center>
    </BackgroundImage>
  )
}
