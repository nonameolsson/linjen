import { Button, Container, createStyles, Text, Title } from '@mantine/core'
import { Link } from '@remix-run/react'
import { useOptionalUser } from '~/utils'

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'relative',
    paddingTop: 120,
    paddingBottom: 80,

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60
    }
  },

  inner: {
    position: 'relative',
    zIndex: 1
  },

  dots: {
    position: 'absolute',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    '@media (max-width: 755px)': {
      display: 'none'
    }
  },

  dotsLeft: {
    left: 0,
    top: 0
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
      textAlign: 'left'
    }
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
  },

  description: {
    textAlign: 'center',

    '@media (max-width: 520px)': {
      textAlign: 'left',
      fontSize: theme.fontSizes.md
    }
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 520px)': {
      flexDirection: 'column'
    }
  },

  control: {
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md
    },

    '@media (max-width: 520px)': {
      height: 42,
      fontSize: theme.fontSizes.md,

      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0
      }
    }
  }
}))

export interface DotsProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number
  radius?: number
}

export function Dots({ size = 185, radius = 2.5, ...others }: DotsProps) {
  return (
    <svg
      aria-hidden
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      viewBox='0 0 185 185'
      width={size}
      height={size}
      {...others}
    >
      <rect width='5' height='5' rx={radius} />
      <rect width='5' height='5' x='60' rx={radius} />
      <rect width='5' height='5' x='120' rx={radius} />
      <rect width='5' height='5' x='20' rx={radius} />
      <rect width='5' height='5' x='80' rx={radius} />
      <rect width='5' height='5' x='140' rx={radius} />
      <rect width='5' height='5' x='40' rx={radius} />
      <rect width='5' height='5' x='100' rx={radius} />
      <rect width='5' height='5' x='160' rx={radius} />
      <rect width='5' height='5' x='180' rx={radius} />
      <rect width='5' height='5' y='20' rx={radius} />
      <rect width='5' height='5' x='60' y='20' rx={radius} />
      <rect width='5' height='5' x='120' y='20' rx={radius} />
      <rect width='5' height='5' x='20' y='20' rx={radius} />
      <rect width='5' height='5' x='80' y='20' rx={radius} />
      <rect width='5' height='5' x='140' y='20' rx={radius} />
      <rect width='5' height='5' x='40' y='20' rx={radius} />
      <rect width='5' height='5' x='100' y='20' rx={radius} />
      <rect width='5' height='5' x='160' y='20' rx={radius} />
      <rect width='5' height='5' x='180' y='20' rx={radius} />
      <rect width='5' height='5' y='40' rx={radius} />
      <rect width='5' height='5' x='60' y='40' rx={radius} />
      <rect width='5' height='5' x='120' y='40' rx={radius} />
      <rect width='5' height='5' x='20' y='40' rx={radius} />
      <rect width='5' height='5' x='80' y='40' rx={radius} />
      <rect width='5' height='5' x='140' y='40' rx={radius} />
      <rect width='5' height='5' x='40' y='40' rx={radius} />
      <rect width='5' height='5' x='100' y='40' rx={radius} />
      <rect width='5' height='5' x='160' y='40' rx={radius} />
      <rect width='5' height='5' x='180' y='40' rx={radius} />
      <rect width='5' height='5' y='60' rx={radius} />
      <rect width='5' height='5' x='60' y='60' rx={radius} />
      <rect width='5' height='5' x='120' y='60' rx={radius} />
      <rect width='5' height='5' x='20' y='60' rx={radius} />
      <rect width='5' height='5' x='80' y='60' rx={radius} />
      <rect width='5' height='5' x='140' y='60' rx={radius} />
      <rect width='5' height='5' x='40' y='60' rx={radius} />
      <rect width='5' height='5' x='100' y='60' rx={radius} />
      <rect width='5' height='5' x='160' y='60' rx={radius} />
      <rect width='5' height='5' x='180' y='60' rx={radius} />
      <rect width='5' height='5' y='80' rx={radius} />
      <rect width='5' height='5' x='60' y='80' rx={radius} />
      <rect width='5' height='5' x='120' y='80' rx={radius} />
      <rect width='5' height='5' x='20' y='80' rx={radius} />
      <rect width='5' height='5' x='80' y='80' rx={radius} />
      <rect width='5' height='5' x='140' y='80' rx={radius} />
      <rect width='5' height='5' x='40' y='80' rx={radius} />
      <rect width='5' height='5' x='100' y='80' rx={radius} />
      <rect width='5' height='5' x='160' y='80' rx={radius} />
      <rect width='5' height='5' x='180' y='80' rx={radius} />
      <rect width='5' height='5' y='100' rx={radius} />
      <rect width='5' height='5' x='60' y='100' rx={radius} />
      <rect width='5' height='5' x='120' y='100' rx={radius} />
      <rect width='5' height='5' x='20' y='100' rx={radius} />
      <rect width='5' height='5' x='80' y='100' rx={radius} />
      <rect width='5' height='5' x='140' y='100' rx={radius} />
      <rect width='5' height='5' x='40' y='100' rx={radius} />
      <rect width='5' height='5' x='100' y='100' rx={radius} />
      <rect width='5' height='5' x='160' y='100' rx={radius} />
      <rect width='5' height='5' x='180' y='100' rx={radius} />
      <rect width='5' height='5' y='120' rx={radius} />
      <rect width='5' height='5' x='60' y='120' rx={radius} />
      <rect width='5' height='5' x='120' y='120' rx={radius} />
      <rect width='5' height='5' x='20' y='120' rx={radius} />
      <rect width='5' height='5' x='80' y='120' rx={radius} />
      <rect width='5' height='5' x='140' y='120' rx={radius} />
      <rect width='5' height='5' x='40' y='120' rx={radius} />
      <rect width='5' height='5' x='100' y='120' rx={radius} />
      <rect width='5' height='5' x='160' y='120' rx={radius} />
      <rect width='5' height='5' x='180' y='120' rx={radius} />
      <rect width='5' height='5' y='140' rx={radius} />
      <rect width='5' height='5' x='60' y='140' rx={radius} />
      <rect width='5' height='5' x='120' y='140' rx={radius} />
      <rect width='5' height='5' x='20' y='140' rx={radius} />
      <rect width='5' height='5' x='80' y='140' rx={radius} />
      <rect width='5' height='5' x='140' y='140' rx={radius} />
      <rect width='5' height='5' x='40' y='140' rx={radius} />
      <rect width='5' height='5' x='100' y='140' rx={radius} />
      <rect width='5' height='5' x='160' y='140' rx={radius} />
      <rect width='5' height='5' x='180' y='140' rx={radius} />
      <rect width='5' height='5' y='160' rx={radius} />
      <rect width='5' height='5' x='60' y='160' rx={radius} />
      <rect width='5' height='5' x='120' y='160' rx={radius} />
      <rect width='5' height='5' x='20' y='160' rx={radius} />
      <rect width='5' height='5' x='80' y='160' rx={radius} />
      <rect width='5' height='5' x='140' y='160' rx={radius} />
      <rect width='5' height='5' x='40' y='160' rx={radius} />
      <rect width='5' height='5' x='100' y='160' rx={radius} />
      <rect width='5' height='5' x='160' y='160' rx={radius} />
      <rect width='5' height='5' x='180' y='160' rx={radius} />
      <rect width='5' height='5' y='180' rx={radius} />
      <rect width='5' height='5' x='60' y='180' rx={radius} />
      <rect width='5' height='5' x='120' y='180' rx={radius} />
      <rect width='5' height='5' x='20' y='180' rx={radius} />
      <rect width='5' height='5' x='80' y='180' rx={radius} />
      <rect width='5' height='5' x='140' y='180' rx={radius} />
      <rect width='5' height='5' x='40' y='180' rx={radius} />
      <rect width='5' height='5' x='100' y='180' rx={radius} />
      <rect width='5' height='5' x='160' y='180' rx={radius} />
      <rect width='5' height='5' x='180' y='180' rx={radius} />
    </svg>
  )
}

export default function Index() {
  const user = useOptionalUser()
  const { classes } = useStyles()

  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Create your own{' '}
          <Text component='span' className={classes.highlight} inherit>
            timelines
          </Text>{' '}
          to visualize it
        </Title>

        <Container p={0} size={600}>
          <Text size='lg' color='dimmed' className={classes.description}>
            Present historical or current events and visualize it. Add more
            events, people and even locations. Share your timelines with others,
            and import data from others.
          </Text>
        </Container>
        {user ? (
          <Button component={Link} to='/timelines'>
            View Timelines for {user.email}
          </Button>
        ) : (
          <div className={classes.controls}>
            <Button
              component={Link}
              to='join'
              className={classes.control}
              size='lg'
              variant='default'
              color='gray'
            >
              Create a free account
            </Button>
            <Button
              component={Link}
              to='login'
              className={classes.control}
              size='lg'
            >
              Log in
            </Button>
          </div>
        )}
      </div>
    </Container>
  )
}
