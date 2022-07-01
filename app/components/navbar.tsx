import { Menu, Transition } from '@headlessui/react'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { Form, Link, useNavigate } from '@remix-run/react'
import { Fragment } from 'react'

export function Navbar({
  showBackButton,
  rightButtons,
  title
}: {
  rightButtons?: JSX.Element
  showBackButton: boolean
  title: string
}): JSX.Element {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  return (
    <div className='navbar w-screen bg-base-100 shadow lg:w-full'>
      <div className='navbar-start'>
        {showBackButton ? (
          <button onClick={goBack} className='btn btn-ghost btn-circle'>
            <ChevronLeftIcon className='h-5 w-5' />
          </button>
        ) : (
          <label
            className='btn btn-ghost btn-circle lg:hidden'
            htmlFor='my-drawer'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
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
        )}
      </div>
      <div className='navbar-center w-full shrink justify-center'>
        <div className='flex flex-col text-center'>
          <span className='text-xl normal-case'>{title}</span>
        </div>
      </div>
      <div className='navbar-end'>
        {rightButtons && rightButtons}
        <Menu as='div' className='dropdown-end dropdown'>
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
              className='dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow'
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
