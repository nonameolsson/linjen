import { Menu, Transition } from '@headlessui/react'
import { MenuAlt2Icon } from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
import { Form, NavLink } from '@remix-run/react'
import { Fragment } from 'react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Navbar({
  setMobileMenuOpen
}: {
  setMobileMenuOpen: (open: boolean) => void
}): JSX.Element {
  return (
    <header className='w-full'>
      <div className='relative z-10 flex h-16 shrink-0 border-b border-gray-200 bg-white shadow-sm'>
        <button
          type='button'
          className='border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden'
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className='sr-only'>Open sidebar</span>
          <MenuAlt2Icon className='h-6 w-6' aria-hidden='true' />
        </button>
        <div className='flex flex-1 justify-between px-4 sm:px-6'>
          <div className='flex flex-1'>
            <form className='flex w-full md:ml-0' action='#' method='GET'>
              <label htmlFor='search-field' className='sr-only'>
                Search all files
              </label>
              <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center'>
                  <SearchIcon className='h-5 w-5 shrink-0' aria-hidden='true' />
                </div>
                <input
                  name='search-field'
                  id='search-field'
                  className='h-full w-full border-transparent py-2 pr-3 pl-8 text-base text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400'
                  placeholder='Search'
                  type='search'
                />
              </div>
            </form>
          </div>
          <div className='ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6'>
            {/* Profile dropdown */}
            <Menu as='div' className='relative shrink-0'>
              <div>
                <Menu.Button className='flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                  <span className='sr-only'>Open user menu</span>
                  <img
                    className='h-8 w-8 rounded-full'
                    src='https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80'
                    alt=''
                  />
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
                <Menu.Items className='absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none'>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                        to='/profile'
                      >
                        Profile
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Form action='/logout' method='post'>
                        <button
                          type='submit'
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'flex w-full px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Logout
                        </button>
                      </Form>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}
