import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { forwardRef } from 'react'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  label?: string
}

export const TextField = forwardRef(
  (props: TextFieldProps, ref: React.Ref<HTMLInputElement>) => {
    if (!props.name && props.autoComplete)
      throw new Error(
        'TextField: name is required when autocomplete is true. Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete'
      )

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
        <input
          aria-describedby={`${props.id}-error`}
          aria-invalid={!!props.errorMessage}
          autoComplete={props.autoComplete}
          autoCapitalize={props.autoCapitalize}
          autoFocus={props.autoFocus}
          className='flex-1 px-3 text-lg leading-loose rounded-md border-2 border-blue-500 focus:border-indigo-500 focus:ring-indigo-500'
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          ref={ref}
          required={props.required}
          type={props.type}
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

TextField.displayName = 'TextField'
