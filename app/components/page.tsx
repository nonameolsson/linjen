import {
  CalendarIcon,
  PresentationChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/solid'
import { Content } from './content'
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
  title
}: {
  children: React.ReactNode
  actions?: JSX.Element
  showBackButton?: boolean
  toolbarButtons?: JSX.Element
  title: string
}): JSX.Element {
  return (
    <div className='drawer-mobile drawer'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col'>
        <Navbar
          title={title}
          rightButtons={toolbarButtons}
          showBackButton={showBackButton}
        />
        <Content title={title} actions={actions}>
          {children}
        </Content>
      </div>

      <div className='drawer-side shadow'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <Sidebar items={sidebarItems} />
      </div>
    </div>
  )
}
