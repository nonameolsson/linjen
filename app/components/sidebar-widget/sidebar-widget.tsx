export interface SidebarWidgetProps {
  children: React.ReactNode
}

export function SidebarWidget(props: SidebarWidgetProps) {
  const { children } = props

  return (
    <section
      aria-labelledby='timeline-title'
      className='lg:col-span-1 lg:col-start-3'
    >
      <div className='bg-white py-5 shadow sm:rounded-lg'>{children}</div>
    </section>
  )
}
