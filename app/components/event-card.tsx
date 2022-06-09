import type { Event } from '@prisma/client'
import { Form, Link } from '@remix-run/react'

interface Props extends Pick<Event, 'startDate' | 'content' | 'title'> {}

export default function EventCard({ content, startDate, title }: Props) {
  return (
    <div className='bg-white p-4'>
      <h3 className='mb-4 text-2xl font-bold'>Title: {title}</h3>
      <p>Content: {content}</p>
      <p>
        Start Date:{' '}
        {new Intl.DateTimeFormat('sv-SE').format(new Date(startDate))}
      </p>

      <hr className='my-4' />

      <Form method='post'>
        <input name='timelineId' hidden />
        <Link
          to='edit'
          className='rounded bg-orange-500 py-2 px-4 text-white hover:bg-orange-600 focus:bg-orange-400'
        >
          Edit
        </Link>
        <button
          type='submit'
          className='rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400'
        >
          Delete
        </button>
      </Form>
    </div>
  )
}
