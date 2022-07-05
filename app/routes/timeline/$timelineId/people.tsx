import { PlusIcon } from '@heroicons/react/solid'
import { Link } from '@remix-run/react'

export default function PeopleTab() {
  return (
    <div className='flex flex-1 items-stretch overflow-hidden'>
      <main className='flex-1 overflow-y-auto p-4'>
        <section className='flex h-full min-w-0 flex-1 flex-col lg:order-last'>
          <Link
            to=''
            className='btn-xl btn btn-primary btn-circle fixed right-4 bottom-4 shadow-2xl drop-shadow-2xl'
          >
            <PlusIcon className='h-5 w-5' aria-hidden='true' />
          </Link>
          <h2>People will be added here</h2>
        </section>
      </main>
    </div>
  )
}
