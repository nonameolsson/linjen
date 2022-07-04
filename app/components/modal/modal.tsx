import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface ModalProps {
  buttons?: JSX.Element
  isOpen: boolean
  closeModal: () => void
  icon?: JSX.Element
  title: string
  description?: string
}

export function Modal({
  buttons,
  closeModal,
  title,
  icon,
  description,
  isOpen
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        onClose={closeModal}
      >
        <div className='modal-open modal modal-bottom sm:modal-middle'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel>
              <div className='modal-box'>
                <div className='sm:flex sm:items-start'>
                  {icon && (
                    <div className='mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                      {icon}
                    </div>
                  )}
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <Dialog.Title as='h3' className='text-lg font-bold'>
                      {title}
                    </Dialog.Title>
                    {description && (
                      <div className='mt-2'>
                        <p>{description}</p>
                      </div>
                    )}
                  </div>
                </div>
                {buttons && <div className='modal-action'>{buttons}</div>}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
