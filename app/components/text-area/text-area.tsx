import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { forwardRef } from 'react'

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string

  label?: string
}

export const TextArea = forwardRef(
  (props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) => {
    return (
      <>
        {props.label && (
          <label
            htmlFor={props.id}
            className='block text-sm font-medium text-gray-700'
          >
            {props.label}
          </label>
        )}
        <textarea
          aria-describedby={`${props.id}-error`}
          aria-invalid={!!props.errorMessage}
          autoComplete={props.autoComplete}
          autoCapitalize={props.autoCapitalize}
          defaultValue={props.defaultValue}
          autoFocus={props.autoFocus}
          className='block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm'
          disabled={props.disabled}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          ref={ref}
          required={props.required}
        />
        {props.errorMessage && (
          <div className='flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none'>
            <ExclamationCircleIcon
              className='w-5 h-5 text-red-500'
              aria-hidden='true'
            />
          </div>
        )}
        {props.errorMessage && (
          <div className='pt-1 text-red-700' id={`${props.id}-error`}>
            {props.errorMessage}
          </div>
        )}
      </>
    )
  }
)

TextArea.displayName = 'TextArea'
