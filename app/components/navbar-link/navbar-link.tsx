import {
  createPolymorphicComponent,
  Tooltip,
  UnstyledButton
} from '@mantine/core'
import { NavLink } from '@remix-run/react'
import { forwardRef } from 'react'
import { useStyles } from './navbar-link.styles'
import type { NavbarLinkProps } from './navbar-link.types'
import { isLink } from './navbar-link.types'

// Create intermediate component with default ref type and props
const _NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ children, ...props }, ref) => {
    const {
      color,
      to,
      onClick,
      collapsed = true,
      icon: Icon,
      title,
      tooltipLabel
      // ...others
    } = props

    const { classes, cx } = useStyles()
    console.log('collapsed', collapsed)

    let extraProps = {}

    if (isLink(to)) {
      extraProps = {
        component: NavLink,
        to: to
      }
    } else {
      extraProps = {
        onClick
      }
    }

    return collapsed ? (
      <Tooltip label={tooltipLabel} position='right' transitionDuration={0}>
        <UnstyledButton
          className={cx(classes.link, { [classes.linkActive]: 'Timelines' })}
          {...extraProps}
        >
          <Icon stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    ) : (
      <UnstyledButton
        className={cx(classes.link, {
          [classes.linkActive]: title === 'Timelines'
        })}
        component='a'
        ref={ref}
        {...props}
        {...extraProps}
      >
        <Icon className={classes.linkIcon} stroke={1.5} />
        <span>{title}</span>
      </UnstyledButton>
    )
  }
)

// export function NavbarLink2(props: NavbarLinkProps): JSX.Element {
//   const {
//     active,
//     color,
//     handle,
//     iconOnly = true,
//     icon: Icon,
//     title,
//     tooltipLabel
//   } = props
//   const { classes, cx } = useStyles()

//   let extraProps = {}

//   if (isLink(handle)) {
//     extraProps = {
//       component: NavLink,
//       to: handle
//     }
//   } else {
//     extraProps = {
//       onClick: handle
//     }
//   }

//   // return iconOnly ? (
//   //   <Tooltip label={tooltipLabel} position='right' transitionDuration={0}>
//   //     <UnstyledButton
//   //       className={cx(classes.link, { [classes.linkActive]: active })}
//   //       {...extraProps}
//   //     >
//   //       <Icon stroke={1.5} />
//   //     </UnstyledButton>
//   //   </Tooltip>
//   // ) : (
//   return (
//     <UnstyledButton
//       className={cx(classes.link, {
//         [classes.linkActive]: title === 'Timelines'
//       })}
//       // sx={theme => ({
//       //   display: 'block',
//       //   width: '100%',
//       //   padding: theme.spacing.xs,
//       //   borderRadius: theme.radius.sm,
//       //   color:
//       //     theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

//       //   '&:hover': {
//       //     backgroundColor:
//       //       theme.colorScheme === 'dark'
//       //         ? theme.colors.dark[6]
//       //         : theme.colors.gray[0]
//       //   }
//       // })}
//       {...extraProps}
//     >
//       <Icon className={classes.linkIcon} stroke={1.5} />
//       <span>{title}</span>
//       {/* <Group>
//         <ThemeIcon color={color} variant='light'>
//           <Icon className={classes.linkIcon} />
//         </ThemeIcon>

//         <Text size='sm'>{title}</Text>
//       </Group> */}
//     </UnstyledButton>
//   )
// }

_NavbarLink.displayName = 'NavbarLink'

// createPolymorphicComponent accepts two types: default element and component props
// all other props will be added to component type automatically
export const NavbarLink = createPolymorphicComponent<'a', NavbarLinkProps>(
  _NavbarLink
)
