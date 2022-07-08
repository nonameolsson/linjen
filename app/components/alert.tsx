import { InformationCircleIcon } from '@heroicons/react/solid'

export function Alert({ text }: { text: string }): JSX.Element {
  return (
    <div className='rounded-md bg-error p-4'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <InformationCircleIcon
            className='h-5 w-5 text-error-content'
            aria-hidden='true'
          />
        </div>
        <p className='ml-3 text-sm text-error-content'>{text}</p>
      </div>
    </div>
  )
}
