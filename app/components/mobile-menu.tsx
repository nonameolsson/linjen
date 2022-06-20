import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { Fragment } from 'react'
import type { SidebarNavigationItem } from './page'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function MobileMenu({
  sidebarNavigation,
  mobileMenuOpen,
  setMobileMenuOpen
}: {
  sidebarNavigation: SidebarNavigationItem[]
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}): JSX.Element {
  return (
    <Transition.Root show={mobileMenuOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-20 md:hidden'
        onClose={setMobileMenuOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='transition-opacity ease-linear duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-opacity ease-linear duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-600/75' />
        </Transition.Child>

        <div className='flex fixed inset-0 z-40'>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <Dialog.Panel className='flex relative flex-col flex-1 pt-5 pb-4 w-full max-w-xs bg-indigo-700'>
              <Transition.Child
                as={Fragment}
                enter='ease-in-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in-out duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='absolute top-1 right-0 p-1 -mr-14'>
                  <button
                    type='button'
                    className='flex justify-center items-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-white'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <XIcon className='w-6 h-6 text-white' aria-hidden='true' />
                    <span className='sr-only'>Close sidebar</span>
                  </button>
                </div>
              </Transition.Child>
              <div className='flex shrink-0 items-center px-4'>
                <img
                  className='w-auto h-8'
                  src='https://tailwindui.com/img/logos/workflow-mark.svg?color=white'
                  alt='Workflow'
                />
              </div>
              <div className='overflow-y-auto flex-1 px-2 mt-5 h-0'>
                <nav className='flex flex-col h-full'>
                  <div className='space-y-1'>
                    {sidebarNavigation.map(item => (
                      <a
                        key={item.name}
                        href={item.to}
                        className={classNames(
                          item.current
                            ? 'bg-indigo-800 text-white'
                            : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                          'group flex items-center rounded-md py-2 px-3 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? 'text-white'
                              : 'text-indigo-300 group-hover:text-white',
                            'mr-3 h-6 w-6'
                          )}
                          aria-hidden='true'
                        />
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </div>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className='shrink-0 w-14' aria-hidden='true'>
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
