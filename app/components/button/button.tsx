import cx from 'classnames'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
}

export function Button(props: ButtonProps) {
  const classNames = cx('btn', {
    'btn-block': props.fullWidth
  })

  return (
    <button className={classNames} type={props.type}>
      <span className='inline-block'>{props.children}</span>
    </button>
  )
}
