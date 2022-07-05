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
          <label htmlFor={props.id} className='label'>
            <span className='label-text'>{props.label}</span>
          </label>
        )}
        <textarea
          aria-describedby={`${props.id}-error`}
          aria-invalid={!!props.errorMessage}
          autoCapitalize={props.autoCapitalize}
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus}
          className={textAreaClassNames}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          id={props.id}
          name={props.name}
          onFocus={props.onFocus}
          placeholder={props.placeholder}
          ref={ref}
          required={props.required}
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

TextArea.displayName = 'TextArea'
