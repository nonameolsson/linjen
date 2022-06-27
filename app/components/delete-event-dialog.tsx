import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useRef } from 'react'

export function DeleteEventDialog({
  isOpen,
  onCloseClick,
  description,
  deleteButton,
  leftButton,
  rightButton,
  icon,
  title
}: {
  isOpen: boolean
  onCloseClick: () => void
  deleteButton?: JSX.Element
  title?: string
  icon?: JSX.Element
  leftButton?: JSX.Element
  rightButton?: JSX.Element
  description?: string
}) {
  const cancelButtonRef = useRef(null)

  function handleClick() {
    // if (callbackFn) {
    //   callbackFn()
    // }

    onCloseClick()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={handleClick}
      >
        {/* <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500/75 transition-opacity' />
        </Transition.Child> */}

        <div className='overflow-y-auto fixed inset-0 z-10'>
          {/* <div className='flex justify-center items-end p-4 min-h-full text-center sm:items-center sm:p-0'> */}
          {/* <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            > */}
          <Dialog.Panel className='overflow-hidden relative text-left bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
            <div className='modal'>
              <div className='modal-box'>
                <h3 className='text-lg font-bold'>
                  Congratulations random Interner user!
                </h3>
                <p className='py-4'>
                  You've been selected for a chance to get one year of
                  subscription to use Wikipedia for free!
                </p>
                <div className='modal-action'>
                  <label htmlFor='my-modal' className='btn'>
                    Yay!
                  </label>
                </div>
              </div>
            </div>
            {/* <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    {icon && (
                      <div className='flex shrink-0 justify-center items-center mx-auto w-12 h-12 bg-red-100 rounded-full sm:mx-0 sm:mr-4 sm:w-10 sm:h-10'>
                        {icon}
                      </div>
                    )}
                    <div className='mt-3 text-center sm:mt-0  sm:text-left'>
                      {title && (
                        <Dialog.Title
                          as='h3'
                          className='text-lg font-medium leading-6 text-gray-900'
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <div className='mt-2'>
                          <p className='text-sm text-gray-500'>{description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}
            {/* <div className='py-3 px-4 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6'>
                  {}
                  <button
                    form='delete-event'
                    type='submit'
                    className='inline-flex justify-center py-2 px-4 w-full text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={handleClick}
                  >
                    Delete
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center py-2 px-4 mt-3 w-full text-base font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={onCloseClick}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div> */}
          </Dialog.Panel>
          {/* </Transition.Child> */}
        </div>
        {/* </div> */}
      </Dialog>
    </Transition.Root>
  )
}
