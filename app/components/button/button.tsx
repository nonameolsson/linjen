export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button(props: ButtonProps) {
  return (
    <button
      className='py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 rounded'
      type={props.type}
    >
      <span className='inline-block'>{props.children}</span>
    </button>
  )
}
