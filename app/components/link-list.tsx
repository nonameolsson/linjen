import { PaperClipIcon } from '@heroicons/react/solid'

export interface ReferenceList {
  items: {
    downloadable?: boolean
    icon?: JSX.Element
    id: string
    name: string
    href: string
  }[]
  title?: string
}

export function LinkList(props: ReferenceList) {
  const { items, title } = props

  return (
    <>
      <dt className='text-sm font-medium text-gray-500'>{title}</dt>
      <dd className='mt-1 text-sm text-gray-900'>
        <ul className='divide-y divide-gray-200 rounded-md border border-gray-200'>
          {items.map(item => (
            <li
              key={item.name}
              className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'
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
                <span className='ml-2 w-0 flex-1 truncate'>{item.name}</span>
              </div>
              {item.downloadable && (
                <div className='ml-4 flex-shrink-0'>
                  <a
                    href={item.href}
                    className='font-medium text-blue-600 hover:text-blue-500'
                  >
                    Download
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      </dd>
    </>
  )
}
