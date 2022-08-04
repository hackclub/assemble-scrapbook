import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Icon from '@hackclub/icons'
import Flag from './flag'

const Join = ({ authStatus }) => (
  <>
    {authStatus.status != 'authed' ? (
      <a href="/login/" className="badge">
        Login
        <style jsx>{`
          a {
            background-color: var(--colors-muted);
            color: var(--colors-background);
            padding: 3px 12px 1px;
            margin-left: 16px;
            text-decoration: none;
            text-transform: uppercase;
            transition: 0.125s background-color ease-in-out;
          }
          a:hover,
          a:focus {
            background-color: var(--colors-purple);
          }
        `}</style>
      </a>
    ) : (
      <a href="/post" className="badge">
        Post To Your Scrapbook
        <style jsx>{`
          a {
            background-color: var(--colors-purple);
            color: var(--colors-background);
            padding: 3px 12px 1px;
            margin-left: 16px;
            text-decoration: none;
            text-transform: uppercase;
            transition: 0.125s background-color ease-in-out;
          }
          a:hover,
          a:focus {
            background-color: var(--colors-white);
          }
        `}</style>
      </a>
    )}
  </>
)

const Nav = ({ authStatus }) => {
  const { pathname } = useRouter()
  const home = pathname === '/'
  // This is a hack for using the right link on custom domains
  const [ext, setExt] = useState(false)
  useEffect(() => {
    try {
      const l = document.createElement('a')
      l.href = window.location.href
      console.log(l.hostname)
      if (!l.hostname.includes('.hackclub.')) setExt(true)
    } catch (e) {}
  }, [])

  return (
    <nav className="nav">
      <Flag />
      {!home && (
        <Link href="/">
          <a className="nav-link nav-link-home">Scrapbook @ Assemble</a>
        </Link>
      )}
      <Link href="https://assemble.hackclub.com" passHref>
        <a className="nav-link nav-link-about">About</a>
      </Link>
      <a
        href="https://github.com/hackclub/scrapbook"
        className="nav-link nav-link-github"
        title="GitHub"
      >
        <Icon glyph="github" size={32} />
      </a>
      <Join authStatus={authStatus} />
    </nav>
  )
}

export default Nav
