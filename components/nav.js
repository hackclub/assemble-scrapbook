import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Icon from '@hackclub/icons'
import Flag from './flag'
import Modal from 'react-modal'

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'var(--colors-background)',
    border: 'none',
    borderRadius: '4px',
    boxShadow: '0 0 24px 0 rgba(0, 0, 0, 0.1)',
    padding: '24px',
    width: '100%',
    maxWidth: '600px'
  }
}

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
  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    try {
      const l = document.createElement('a')
      l.href = window.location.href
      console.log(l.hostname)
      if (!l.hostname.includes('.hackclub.')) setExt(true)
    } catch (e) {}
  }, [])

  const openModal = () => {
    setModalIsOpen(true)
  }
  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <nav className="nav">
      <Flag />
      {!home && (
        <Link href="/">
          <a className="nav-link nav-link-home cursor-pointer">
            Scrapbook @ Assemble
          </a>
        </Link>
      )}
      <a className="nav-link nav-link-about cursor-pointer" onClick={openModal}>
        About
      </a>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="About Scrapbook"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <h2>Scrapbook @ Assemble</h2>
          <button onClick={closeModal}>x</button>
          <style jsx>{`
            button {
              color: var(--colors-background);
              padding: 3px 12px 1px;
              margin-left: 16px;
              text-decoration: none;
              text-transform: uppercase;
              transition: 0.125s background-color ease-in-out;
              border: none;
              border-radius: 50%;
              cursor: pointer;
            }
          `}</style>
        </div>
        <div>
          <p>
            Hackathons provide a space to build projects with code— to hone
            skills and pick up new concepts while getting hands-on. At Assemble,
            Scrapbook is a way for hackers to share the things they're making
            and inspire each other to do the same.
          </p>
          <br />
          <p>
            To get started, sign in with your Assemble account, and make a post!
            There are 2 types of posts:
            <ul style={{ marginLeft: '24px' }}>
              <li>
                a <strong style={{ color: 'var(--colors-blue)' }}>scrap</strong>{' '}
                is a "work in progress" post
              </li>
              <li>
                a <strong style={{ color: 'var(--colors-red)' }}>ship</strong>{' '}
                is a way to share a completed project which will be used for
                exhibition
              </li>
            </ul>
          </p>
          <br />
          <p>Happy hacking!</p>
        </div>
      </Modal>
      <a
        href="https://github.com/hackclub/assemble-scrapbook"
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
