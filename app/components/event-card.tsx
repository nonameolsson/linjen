import type { Event, Location, Timeline } from '@prisma/client'
import { Link } from '@remix-run/react'

interface Props extends Pick<Event, 'startDate' | 'content' | 'title' | 'id'> {
  locations: Location[]
  events: Event[]
  timelines: { id: Timeline['id']; title: Timeline['title'] }[]
}

export default function EventCard({
  content,
  events,
  id,
  timelines,
  locations,
  startDate,
  title
}: Props) {
  return (
    <div className='bg-white p-4'>
      <h3 className='mb-4 text-2xl font-bold'>{title}</h3>
      <p>{content}</p>
      <p>
        Start Date:{' '}
        {new Intl.DateTimeFormat('sv-SE').format(new Date(startDate))}
      </p>

      <div className='divider' />

      <h3 className='font-semibold'>Events</h3>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </ul>

      <div className='divider' />

      <h3 className='font-semibold'>Locations</h3>
      <ul>
        {locations.map(location => (
          <li key={location.id}>{location.title}</li>
        ))}
      </ul>

      <div className='divider' />

      <h3 className='font-semibold'>Timelines</h3>
      <ul>
        {timelines.map(timeline => (
          <li className='link' key={timeline.id}>
            <Link to={`/timeline/${timeline.id}/events`}>{timeline.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
