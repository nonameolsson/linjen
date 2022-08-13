import { BackgroundImage, Box, Container, Text, Title } from '@mantine/core'
import { useOptionalUser } from '~/utils'

export default function Index() {
  const user = useOptionalUser()

  return (
    <Container size={'xl'} fluid>
       <Box sx={{ maxWidth: 300 }} mx="auto">
      <BackgroundImage src='images/landing.jpg' radius='md'>
        <Title align='center' order={1}>
          Linjen
        </Title>
        <Text align='center'>Create and visualize your own timelines.</Text>
      </BackgroundImage>
      </Box>
    </Container>
  )
}
