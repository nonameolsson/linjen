import { PlusIcon } from '@heroicons/react/solid'
import { Container } from '@mantine/core'
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams
} from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
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
        icon={<PlusIcon className='h-5 w-5' aria-hidden='true' />}
        offset={true}
        link={`/event/new?timelineId=${params.timelineId}`}
      />

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
    </>
  )
}
