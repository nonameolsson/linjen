import { Menu, Transition } from '@headlessui/react'
import { Form, Link } from '@remix-run/react'
import { Fragment } from 'react'

export function Navbar({
  description,
  title
}: {
  description?: title
  title: string
}): JSX.Element {
  return (
    <div className='w-full shadow navbar bg-base-100'>
      <div className='navbar-start'>
        <label
          className='lg:hidden  btn btn-ghost btn-circle'
          htmlFor='my-drawer'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-5 h-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h7'
            />
          </svg>
        </label>
      </div>
      <div className='navbar-center'>
        <div className='flex flex-col text-center'>
          <span className='text-xl normal-case'>{title}</span>
          <span className='text-gray-500 normal-case'>{description}</span>
        </div>
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
