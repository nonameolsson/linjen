import type { Event, Location } from '@prisma/client'
import { Link } from '@remix-run/react'

interface Props extends Pick<Event, 'startDate' | 'content' | 'title' | 'id'> {
  locations: Location[]
  events: Event[]
  onDeleteClick?: () => void
}

export default function EventCard({
  content,
  events,
  id,
  locations,
  onDeleteClick,
  startDate,
  title
}: Props) {
  return (
    <div className='p-4 bg-white'>
      <h3 className='mb-4 text-2xl font-bold'>{title}</h3>
      <p>{content}</p>
      <p>
        Start Date:{' '}
        {new Intl.DateTimeFormat('sv-SE').format(new Date(startDate))}
      </p>

      <div className='divider' />

      <p>Events</p>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </ul>

      <div className='divider' />

      <p>Locations</p>
      <ul>
        {locations.map(location => (
          <li key={location.id}>{location.title}</li>
        ))}
      </ul>

      <div className='divider' />

      <div className='flex justify-between'>
        <Link to={`/event/${id}/edit`} className='btn btn-warning'>
          Edit
        </Link>
        {onDeleteClick && (
          <button
            disabled={!onDeleteClick}
            onClick={() => onDeleteClick()}
            type='button'
            className='btn btn-error btn-outline'
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
