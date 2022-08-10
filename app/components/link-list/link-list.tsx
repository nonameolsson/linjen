import { PaperClipIcon, PlusIcon } from '@heroicons/react/solid'
import { useFetcher } from '@remix-run/react'
import cx from 'classnames'
import type { Link, LinkListProps } from './link-list.types'

function LinkItem({ link }: { link: Link }) {
  const { icon, id, title, url } = link
  const fetcher = useFetcher()
  const isDeleting = fetcher.submission?.formData.get('linkId') === link.id

  const classNames = cx(
    'flex items-center justify-between text-sm transition-opacity duration-100 hover:bg-gray-50',
    {
      'opacity-0': isDeleting
    }
  )

  return (
    <li key={title} className={classNames}>
      <a
        href={url}
        target='_blank'
        rel='noreferrer'
        className='fontonNewClick-medium text-primary hover:text-primary-focus flex flex-1 py-3 pl-3 pr-4'
      >
        <div className='flex w-0 flex-1 items-center'>
          {icon ? (
            icon
          ) : (
            <PaperClipIcon
              className='h-5 w-5 flex-shrink-0 text-gray-400'
              aria-hidden='true'
            />
          )}
          <span className='ml-2 w-0 flex-1 truncate'>{title}</span>
        </div>
      </a>
      <div className='ml-4 flex-shrink-0 py-3 pl-3 pr-4'>
        <fetcher.Form method='post' action={`/externallink/${id}`}>
          <input type='hidden' name='linkId' value={id} />
          <button
            className='text-secondary hover:text-secondary-focus'
            type='submit'
          >
            Delete
          </button>
        </fetcher.Form>
      </div>
    </li>
  )
}

export function LinkList(props: LinkListProps) {
  const { items, onNewClick, title } = props

  return (
    <>
      <dt className='text-sm font-medium text-gray-500'>{title}</dt>
      <dd className='mt-1 text-sm text-gray-900'>
        <ul className='divide-y divide-gray-200 rounded-md border border-gray-200'>
          {items.map((item: Link) => (
            <LinkItem key={item.id} link={item} />
          ))}
          <li
            onClick={onNewClick}
            className='flex items-center justify-between text-sm hover:bg-gray-50 hover:cursor-pointer py-3 pl-3 pr-4'
          >
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
