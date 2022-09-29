import { Transition, UnstyledButton } from '@mantine/core'
import { Link } from '@remix-run/react'
import { useEffect, useState } from 'react'

import { useStyles } from './fab.styles'
import type { FabProps } from './fab.types'

export function Fab(props: FabProps) {
  const [mounted, setMounted] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { link, icon, offset, onClick } = props
  const { classes } = useStyles({ offset })

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Transition
      mounted={mounted}
      transition='slide-up'
      duration={400}
      timingFunction='ease'
    >
      {styles =>
        link ? (
          <UnstyledButton
            className={classes.button}
            component={Link}
            to={link}
            style={styles}
          >
            <div>{icon}</div>
          </UnstyledButton>
        ) : (
          <UnstyledButton
            className={classes.button}
            onClick={onClick}
            style={styles}
          >
            <div>{icon}</div>
          </UnstyledButton>
        )
      }
    </Transition>
  )
}
