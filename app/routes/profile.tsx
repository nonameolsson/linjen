import { Page } from '~/components/page'
import { useUser } from '~/utils'

export default function NotesPage() {
  const user = useUser()

  return <Page title='Profile'>{user.email}</Page>
}
