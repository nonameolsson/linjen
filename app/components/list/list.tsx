import { Link } from '@remix-run/react'

export interface ListProps {
  items: { id: string; title: string; description?: string; linkTo: string }[]
  title?: string
}

export function List(props: ListProps) {
  const { items, title } = props

  return (
    <>
      {title && (
        <h2 className='text-lg font-medium text-gray-900 mx-4 pb-4'>{title}</h2>
      )}

      <div className='flow-root'>
        <ul className='divide-y divide-gray-200'>
          {items.map(item => (
            <li key={item.id}>
              <Link to={item.linkTo}>
                <div className='bg-white hover:bg-gray-50 p-4'>
                  <p className='text-sm font-medium text-gray-900'>
                    {item.title}
                  </p>
                  {item.description && (
                    <p className='text-sm text-gray-500 truncate'>
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
