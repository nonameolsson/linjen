import { Form } from '@remix-run/react'
import { Content } from '~/components/content'
import { Page } from '~/components/page'
import { useUser } from '~/utils'

const pageTitle = 'Profile'

export default function NotesPage() {
  const user = useUser()

  return (
    <Page title={pageTitle}>
      <Content>
        <div>{user.email}</div>
        <Form action='/logout' method='post'>
          <ul>
            <li>
              <button type='submit'>Log out</button>
            </li>
          </ul>
        </Form>
      </Content>
    </Page>
  )
}
