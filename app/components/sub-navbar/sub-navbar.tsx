import { useState } from 'react'
import { useStyles } from '../navbar/navbar.styles'

const linksMockdata = [
  'Security',
  'Settings',
  'Dashboard',
  'Releases',
  'Account',
  'Orders',
  'Clients',
  'Databases',
  'Pull Requests',
  'Open Issues',
  'Wiki pages'
]

export function SubNavbar(): JSX.Element {
  const { classes, cx } = useStyles()
  const [active, setActive] = useState('Releases')
  const [activeLink, setActiveLink] = useState('Settings')

  return (
    <>
      {linksMockdata.map(link => (
        <a
          className={cx(classes.link, {
            [classes.linkActive]: activeLink === link
          })}
          href='/'
          onClick={event => {
            event.preventDefault()
            setActiveLink(link)
          }}
          key={link}
        >
          {link}
        </a>
      ))}
    </>
  )
}
