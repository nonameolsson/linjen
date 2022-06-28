import cx from 'classnames'
import { forwardRef } from 'react'

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string
  label?: string
}

export const TextArea = forwardRef(
  (props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) => {
    const wrapperClassNames = cx(`form-control ${props.className}`)
    const textAreaClassNames = cx('textarea textarea-bordered', {
      'textarea-error': props.errorMessage
    })

    return (
      <div className={wrapperClassNames}>
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
          className={textAreaClassNames}
          disabled={props.disabled}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          ref={ref}
          required={props.required}
        />
        {props.errorMessage && (
          <label className='label'>
            <span className='label-text-alt'>{props.errorMessage}</span>
          </label>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
