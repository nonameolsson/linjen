import { Menu, Transition } from '@headlessui/react'
import { MenuAlt2Icon } from '@heroicons/react/outline'
import { Form, Link } from '@remix-run/react'
import { Fragment } from 'react'

export function Navbar({
  setMobileMenuOpen,
  title
}: {
  setMobileMenuOpen: (open: boolean) => void
  title: string
}): JSX.Element {
  return (
    <div className='navbar bg-base-100'>
      <div className='navbar-start'>
        <button
          type='button'
          className='px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden'
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className='sr-only'>Open sidebar</span>
          <MenuAlt2Icon className='w-6 h-6' aria-hidden='true' />
        </button>
      </div>
      <div className='navbar-center'>
        <span className='text-xl normal-case'>{title}</span>
      </div>
      <div className='navbar-end'>
        <Menu as='div' className='dropdown dropdown-end'>
          <div>
            <Menu.Button className='btn btn-ghost btn-circle avatar'>
              <span className='sr-only'>Open user menu</span>
              <div className='w-10 rounded-full'>
                <img
                  src='https://api.lorem.space/image/face?hash=33791'
                  alt=''
                />
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items
              as='ul'
              className='p-2 mt-3 w-52 shadow menu menu-compact dropdown-content bg-base-100 rounded-box'
            >
              <Menu.Item as='li'>
                <Link to='/profile'>Profile</Link>
              </Menu.Item>
              <Menu.Item as='li'>
                <Form action='/logout' method='post'>
                  <button type='submit'>Logout</button>
                </Form>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}
