import type { Event, Location } from '@prisma/client'
import { Link } from '@remix-run/react'

interface Props extends Pick<Event, 'startDate' | 'content' | 'title'> {
  locations: Location[]
  events: Event[]
  onDeleteClick?: () => void
}

export default function EventCard({
  content,
  onDeleteClick,
  events,
  startDate,
  locations,
  title
}: Props) {
  return (
    <>
      <label htmlFor='my-modal' className='btn modal-button'>
        open modal
      </label>
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='text-lg font-bold'>
            Congratulations random Interner user!
          </h3>
          <p className='py-4'>
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
          <div className='modal-action'>
            <label htmlFor='my-modal' className='btn'>
              Yay!
            </label>
          </div>
        </div>
      </div>
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
          <Link to='edit' className='btn btn-warning'>
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
    </>
  )
}
