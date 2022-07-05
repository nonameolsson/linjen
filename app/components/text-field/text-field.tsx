import cx from 'classnames'
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

    const inputClassNames = cx('input input-bordered', {
      'input-error': !!props.errorMessage
    })

    return (
      <div className={`form-control w-full ${props.className}`}>
        {props.label && (
          <label htmlFor={props.id} className='label'>
            <span className='label-text'>{props.label}</span>
          </label>
        )}
        <input
          aria-describedby={`${props.id}-error`}
          aria-invalid={!!props.errorMessage}
          autoCapitalize={props.autoCapitalize}
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus}
          className={inputClassNames}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          id={props.id}
          name={props.name}
          onFocus={props.onFocus}
          placeholder={props.placeholder}
          ref={ref}
          required={props.required}
          type={props.type}
        />
        {props.errorMessage && (
          <label className='label' id={`${props.id}-error`}>
            <span className='label-text-alt'>{props.errorMessage}</span>
          </label>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
