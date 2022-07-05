import { LogoutIcon, UserIcon } from '@heroicons/react/solid'
import { Form, NavLink } from '@remix-run/react'

import type { SidebarNavigationItem } from './sidebar.types'

export function Sidebar({ items }: { items: SidebarNavigationItem[] }) {
  return (
    <div className='flex w-80 flex-col justify-between overflow-y-auto bg-base-100 text-base-content'>
      <ul className='menu rounded-box w-full self-start p-4'>
        {items.map(item => (
          <li key={item.name}>
            <NavLink to={item.to}>
              <item.icon className='h-5 w-5' />
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
      <Form action='/logout' method='post' className='flex flex-col'>
        <div className='divider' />
        <ul className='menu rounded-box p-4'>
          <li>
            <NavLink to='/profile'>
              <UserIcon className='h-5 w-5' />
              Profile
            </NavLink>
          </li>
          <li>
            <button type='submit'>
              <LogoutIcon className='h-5 w-5' />
              Log out
            </button>
          </li>
        </ul>
      </Form>
    </div>
  )
}
