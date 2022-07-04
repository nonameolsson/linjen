import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { Link } from "@remix-run/react";
import { Fragment } from "react";

export function OverflowButton({ onDeleteClick }: { onDeleteClick: () => void }) {
  return (
    <Menu as='div' className='flex items-stretch'>
      <div className='dropdown-end dropdown'>
        <Menu.Button className='btn btn-ghost rounded-btn'>
          <span className='sr-only'>Open options</span>
          <DotsVerticalIcon className='h-5 w-5' aria-hidden='true' />
        </Menu.Button>

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
            className='dropdown-content menu rounded-box mt-4 w-52 bg-base-100 p-2 shadow'
          >
            <Menu.Item as='li'>
              <Link to='edit'>
                <PencilAltIcon
                  className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                  aria-hidden='true'
                />
                Edit
              </Link>
            </Menu.Item>
            <Menu.Item as='li' onClick={onDeleteClick}>
              <a>
                <TrashIcon
                  className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                  aria-hidden='true'
                />
                Delete
              </a>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  )
}
