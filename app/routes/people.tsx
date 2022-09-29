import { IconPlus } from '@tabler/icons'

import { Container } from '@mantine/core'
import { Link } from '@remix-run/react'
import { Page } from '~/components/page'

const PAGE_TITLE = 'People'

export default function PeoplePage() {
  return (
    <Page title={PAGE_TITLE} footer={<div>FOOTER</div>}>
      <Container>
        <Link to=''>
          <IconPlus />
        </Link>
        <h2>People will be added here</h2>
      </Container>
    </Page>
  )
}
