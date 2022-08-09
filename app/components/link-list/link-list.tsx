import { PaperClipIcon, PlusIcon } from '@heroicons/react/solid'
import { useFetcher } from '@remix-run/react'
import type { Link, LinkListProps } from './link-list.types'

export function LinkList(props: LinkListProps) {
  const { items, title } = props
  const link = useFetcher()

  return (
    <>
      <dt className='text-sm font-medium text-gray-500'>{title}</dt>
      <dd className='mt-1 text-sm text-gray-900'>
        <ul className='divide-y divide-gray-200 rounded-md border border-gray-200'>
          {items.map((item: Link) => (
            <li
              key={item.title}
              className='flex items-center justify-between text-sm hover:bg-gray-50'
            >
              <a
                href={item.url}
                target='_blank'
                rel='noreferrer'
                className='font-medium text-primary hover:text-primary-focus flex flex-1 py-3 pl-3 pr-4'
              >
                <div className='flex w-0 flex-1 items-center'>
                  {item.icon ? (
                    item.icon
                  ) : (
                    <PaperClipIcon
                      className='h-5 w-5 flex-shrink-0 text-gray-400'
                      aria-hidden='true'
                    />
                  )}
                  <span className='ml-2 w-0 flex-1 truncate'>{item.title}</span>
                </div>
              </a>
              <div className='ml-4 flex-shrink-0 py-3 pl-3 pr-4'>
                <link.Form method='post' action={`/externallink/${item.id}`}>
                  <input type='hidden' name='linkId' value={item.id} />
                  <button type='submit' disabled={link.state === 'submitting'}>
                    Delete
                  </button>
                </link.Form>
              </div>
            </li>
          ))}
          <li className='flex items-center justify-between text-sm hover:bg-gray-50 py-3 pl-3 pr-4'>
            <div className='flex w-0 flex-1 items-center'>
              <PlusIcon
                className='h-5 w-5 flex-shrink-0 text-gray-400'
                aria-hidden='true'
              />

              <span className='ml-2 w-0 flex-1 truncate'>New link</span>
            </div>
          </li>
        </ul>
      </dd>
    </>
  )
}
