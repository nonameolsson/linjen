import {
  CalendarIcon,
  PresentationChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/solid'
import { Fab } from './fab'
import { Navbar } from './navbar'
import type { SidebarNavigationItem } from './sidebar'
import { Sidebar } from './sidebar'

const sidebarItems: SidebarNavigationItem[] = [
  { name: 'Timelines', to: '/timelines', icon: PresentationChartBarIcon },
  { name: 'Events', to: '/events', icon: CalendarIcon },
  { name: 'People', to: '/people', icon: UserGroupIcon }
]

export function Page({
  children,
  actions,
  toolbarButtons,
  showBackButton = false,
  goBackTo,
  fab,
  title
}: {
  children: React.ReactNode
  actions?: JSX.Element
  goBackTo?: string
  showBackButton?: boolean
  toolbarButtons?: JSX.Element
  fab?: {
    offset: boolean
    icon: JSX.Element
    to: string
  }
  title: string
}): JSX.Element {
  return (
    <div className='drawer-mobile drawer'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col'>
        <Navbar
          className='lg:hidden'
          title={title}
          goBackTo={goBackTo}
          rightButtons={toolbarButtons}
          showBackButton={showBackButton}
        />

        {fab && <Fab offset={fab.offset} link={fab.to} icon={fab.icon} />}

        {children}
      </div>

      <div className='drawer-side shadow'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <Sidebar items={sidebarItems} />
      </div>
    </div>
  )
}
