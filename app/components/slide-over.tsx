import { Dialog, Transition } from '@headlessui/react'
import { UploadIcon, XIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import { Fragment, useCallback, useState } from 'react'
import { Fab } from './fab'

export interface SlideOverProps {
  children: React.ReactNode
  className?: string
  title: string
}

export function SlideOver(props: SlideOverProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { children, className, title } = props

  const openSlideOver = useCallback(() => setIsOpen(true), [])
  const closeSlideOver = useCallback(() => setIsOpen(false), [])

  return (
    <div className='xl:hidden'>
      <Fab
        onClick={openSlideOver}
        offset={false}
        icon={<UploadIcon className='-rotate-90 h-5 w-5' aria-hidden='true' />}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className={classNames('relative z-10', className)}
          onClose={closeSlideOver}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-in-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in-out duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-y-scroll bg-white pb-6 shadow-xl'>
                      <div className='p-4 sm:px-6 sticky top-0 z-10 bg-white shadow'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='text-lg font-medium text-gray-900'>
                            {title}
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                              onClick={closeSlideOver}
                            >
                              <span className='sr-only'>Close panel</span>
                              <XIcon className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        {children}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}
