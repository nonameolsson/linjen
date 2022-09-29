import type { DefaultProps, Selectors } from '@mantine/core'
import {
  Box,
  Group,
  Text,
  Title,
  useComponentDefaultProps
} from '@mantine/core'

import type { ContentPaperStylesParams } from './content-paper.styles'
import useStyles from './content-paper.styles'

type ContentPaperStylesNames = Selectors<typeof useStyles>

interface ContentPaperProps
  extends DefaultProps<ContentPaperStylesNames, ContentPaperStylesParams> {
  children: React.ReactNode
  description?: string
  title?: string

  /** Defaults to `inside` */
  titlePosition?: 'inside' | 'outside'
  button?: JSX.Element
}

const defaultProps: Partial<ContentPaperProps> = {
  titlePosition: 'outside'
}

export function ContentPaper(props: ContentPaperProps): JSX.Element {
  const {
    button,
    description,
    titlePosition,
    children,
    className,
    classNames,
    styles,
    unstyled,
    title,
    ...others
  } = useComponentDefaultProps('ContentPaper', defaultProps, props)

  const { classes, cx } = useStyles(
    {},
    { name: 'ContentPaper', classNames, styles, unstyled }
  )

  return (
    <Box className={cx(classes.root, className)} {...others}>
      {title && titlePosition === 'outside' && (
        <Group position='apart' className={classes.headerWrapper}>
          <Title order={3} className={classes.titleOutside}>
            {title}
          </Title>
          {button && <div>{button}</div>}
        </Group>
      )}

      <Box className={classes.container}>
        {title && titlePosition === 'inside' && (
          <Title order={3} className={classes.titleInside}>
            {title}
          </Title>
        )}
        {description && (
          <Text color='dimmed' className={classes.description}>
            {description}
          </Text>
        )}

        {children && <Box className={classes.content}>{children}</Box>}
      </Box>
    </Box>
  )
}
