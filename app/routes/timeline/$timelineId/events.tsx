import { Container, NavLink, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams
} from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { IconChevronRight, IconPlus } from '@tabler/icons'
import { DataTable } from 'mantine-datatable'
import invariant from 'tiny-invariant'

import { Fab } from '~/components'
import type { Event } from '~/models/event.server'
import { getEventListItemsForTimeline } from '~/models/event.server'
import { requireUserId } from '~/session.server'

type LoaderData = {
  events: Event[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)
  invariant(params.timelineId, 'timelineId not found')

  const events = await getEventListItemsForTimeline({
    timelineId: params.timelineId
  })

  return json<LoaderData>({
    events
  })
}

export default function EventsTab() {
  const params = useParams()
  const location = useLocation()
  const data = useLoaderData<LoaderData>()
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)

  const tableData = data.events.map(event => ({
    id: event.id,
    title: event.title,
    startDate: new Intl.DateTimeFormat('sv-SE').format(
      new Date(event.startDate)
    )
  }))

  return (
    <>
      <Fab
        icon={<IconPlus />}
        offset={true}
        link={`/event/new?timelineId=${params.timelineId}`}
      />
      {isMobile ? (
        <Container
          fluid
          px={0}
          sx={{
            backgroundColor: 'white',
            width: '100%',
            height: 'stretch',
            overflowY: 'scroll',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 50px) + 1em)'
          }}
        >
          {tableData.map(item => (
            // eslint-disable-next-line jsx-a11y/anchor-has-content
            <NavLink
              key={item.id}
              description={item.startDate}
              component={Link}
              label={item.title}
              rightSection={<IconChevronRight size={12} stroke={1.5} />}
              to={`/event/${item.id}?from=${location.pathname}`}
            />
          ))}
        </Container>
      ) : (
        <Container size={50}>
          <DataTable
            withBorder={false}
            withColumnBorders
            records={tableData}
            columns={[
              { accessor: 'title' },
              {
                accessor: 'startDate',
                visibleMediaQuery: theme =>
                  `(min-width: ${theme.breakpoints.md}px)`
              }
            ]}
            // execute this callback when a row is clicked
            onRowClick={({ id }) =>
              navigate(`/event/${id}?from=${location.pathname}`)
            }
          />
        </Container>
      )}
    </>
  )
}
