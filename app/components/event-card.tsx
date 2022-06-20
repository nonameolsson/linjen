import type { Event } from '@prisma/client'
import { Link } from '@remix-run/react'

interface Props extends Pick<Event, 'startDate' | 'content' | 'title'> {
  onDeleteClick?: () => void
}

export default function EventCard({
  content,
  onDeleteClick,
  startDate,
  title
}: Props) {
  return (
    <>
      <div className='p-4 bg-white'>
        <h3 className='mb-4 text-2xl font-bold'>Title: {title}</h3>
        <p>Content: {content}</p>
        <p>
          Start Date:{' '}
          {new Intl.DateTimeFormat('sv-SE').format(new Date(startDate))}
        </p>

        <hr className='my-4' />

        <Link
          to='edit'
          className='py-2 px-4 text-white bg-orange-500 hover:bg-orange-600 focus:bg-orange-400 rounded'
        >
          Edit
        </Link>
        {onDeleteClick && (
          <button
            disabled={!onDeleteClick}
            onClick={() => onDeleteClick()}
            type='button'
            className='py-2 px-4 text-white bg-red-500 hover:bg-red-600 focus:bg-red-400 rounded'
          >
            Delete
          </button>
        )}
      </div>
    </>
  )
}
