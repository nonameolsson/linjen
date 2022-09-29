import { Container, Text } from '@mantine/core'
import { Page } from '~/components/page'

const PAGE_TITLE = 'Locations'

export default function PeoplePage() {
  return (
    <Page title={PAGE_TITLE}>
      <Container>
        <Text>Locations be added here</Text>
      </Container>
    </Page>
  )
}
