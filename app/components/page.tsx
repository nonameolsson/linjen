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
  description,
  title
}: {
  children: React.ReactNode
  actions?: JSX.Element
  description?: string
  title: string
}): JSX.Element {
  return (
    <div className='drawer drawer-mobile'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        <Navbar title={title} />
        <Content description={description} title={title} actions={actions}>
          {children}
        </Content>
      </div>

      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <ul className='overflow-y-auto p-4 w-80 menu bg-base-100 text-base-content'>
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
