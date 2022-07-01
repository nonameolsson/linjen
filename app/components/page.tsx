import {
  HomeIcon,
  PhotographIcon,
  ViewGridIcon
} from '@heroicons/react/outline'
import { NavLink } from '@remix-run/react'

import { Content } from './content'
import { Navbar } from './navbar'

// TODO: Move to type file
export type SidebarNavigationItem = {
  name: string
  to: string
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  current: boolean
}

const sidebarNavigation: SidebarNavigationItem[] = [
  { name: 'Timelines', to: '/timelines', icon: HomeIcon, current: false },
  { name: 'Events', to: '/events', icon: ViewGridIcon, current: false },
  { name: 'People', to: '/people', icon: PhotographIcon, current: true }
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
        <ul className='menu w-80 overflow-y-auto bg-base-100 p-4 text-base-content'>
          {sidebarNavigation.map(item => (
            <li key={item.name}>
              <NavLink to={item.to}>{item.name}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
