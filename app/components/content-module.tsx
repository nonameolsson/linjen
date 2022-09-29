import { Divider, Paper, Title } from '@mantine/core'

export interface ContentModuleProps {
  title: string
  children: React.ReactNode
}

export function ContentModule(props: ContentModuleProps) {
  const { children, title } = props

  return (
    <Paper
      withBorder
      aria-labelledby='applicant-information-title'
      shadow='md'
      p='xl'
      radius='md'
    >
      <Title order={2} id='applicant-information-title'>
        {title}
      </Title>

      <Divider my='sm' variant='solid' />

      <div>{children}</div>
    </Paper>
  )
}
