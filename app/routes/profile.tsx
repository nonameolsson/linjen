import { Content } from '~/components/content'
import { Page } from '~/components/page'
import { useUser } from '~/utils'

const pageTitle = 'Profile'

export default function NotesPage() {
  const user = useUser()

  return (
    <Page title={pageTitle}>
      <Content>
        <div className='col-start-4 col-span-8'>{user.email}</div>
      </Content>
    </Page>
  )
}
