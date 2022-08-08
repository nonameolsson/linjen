import { NavLink } from '@remix-run/react'
import cx from 'classnames'
export interface DesktopTabsProps {
  tabs: {
    name: string
    linkTo: string
  }[]
}

export function DesktopTabs(props: DesktopTabsProps) {
  const { tabs } = props

  return (
    <div className='hidden sm:block'>
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
          {tabs.map(tab => (
            <NavLink
              key={tab.name}
              to={tab.linkTo}
              className={({ isActive }) =>
                cx(
                  'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                  {
                    'border-primary text-primary': isActive,
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                      !isActive
                  }
                )
              }
            >
              <span>{tab.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
