import { convertTimestampToDate } from '../lib/dates'
import { proxy } from '../lib/images'
import { filter } from 'lodash'
import Icon from '@hackclub/icons'
import Link from 'next/link'
import Content from './content'
import Cartridges from './cartridges'
import Video from './video'
import Image from 'next/image'
import Reaction from './reaction'
import dynamic from 'next/dynamic'
import { emailToPfp } from '../lib/email'
const Tooltip = dynamic(() => import('react-tooltip'), { ssr: false })
import useSound from 'use-sound'
import { mutate } from 'swr'

const zeroPad = (num, places) => String(num).padStart(places, '0')

const imageFileTypes = ['jpg', 'jpeg', 'png', 'gif']

const audioFileTypes = ['mp3', 'wav', 'aiff', 'm4a']

function formatDate(postedAt) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
  const date =
    typeof days[new Date(postedAt).getDay()] !== 'undefined'
      ? new Date(postedAt)
      : new Date()
  const dayIndex = date.getDay()
  const dayName = days[dayIndex]
  return `${dayName}, ${date.getHours()}:${zeroPad(date.getMinutes(), 2)}`
}

function endsWithAny(suffixes, string) {
  try {
    return suffixes.some(function (suffix) {
      return string.endsWith(suffix)
    })
  } catch {
    return false
  }
}

function Post({
  id = new Date().toISOString(),
  profile = false,
  user = {
    username: 'abc',
    avatar: '',
    displayStreak: false,
    streakCount: 0
  },
  text,
  attachments = [],
  mux = [],
  reactions = [],
  postedAt = new Date().toISOString(),
  claps,
  muted = false,
  isShip,
  composing,
  mutateFunc,
  collaborators,
  title
}) {
  let play = useSound([`/api/sound?id=${id}`])[0]
  return (
    <section
      className="post"
      id={id}
      style={{
        border: isShip
          ? '1px solid var(--colors-blue)'
          : '1px solid var(--colors-red)',
        ...(muted ? { opacity: muted, pointerEvents: 'none' } : {})
      }}
    >
      {profile || !user ? (
        <header className="post-header">
          <time className="post-header-date" dateTime={postedAt}>
            {formatDate(postedAt)}
          </time>
        </header>
      ) : (
        <span className="post-header">
          <Link href="/[profile]" as={`/${user.username}`} prefetch={false}>
            <a className="post-header">
              <Image
                loading="lazy"
                src={
                  user.avatar ||
                  emailToPfp(user.email) ||
                  'https://github.com/ghost.png'
                }
                width={48}
                height={48}
                alt={user.username}
                className="post-header-avatar"
              />
            </a>
          </Link>
          <Link href="/[profile]" as={`/${user.username}`} prefetch={false}>
            <a className="post-header" style={{ flexGrow: 1 }}>
              <section className="post-header-container">
                <span className="post-header-name">
                  <strong>@{user.username}</strong>
                  {user.css && (
                    <Icon
                      size={24}
                      glyph="rep"
                      title="Has a customized profile"
                      className="post-header-css"
                    />
                  )}
                  {composing && (
                    <span
                      className="composing-tag"
                      style={{
                        backgroundColor: '#eace23',
                        color: 'white',
                        padding: '2px',
                        boxSizing: 'border-box',
                        display: 'inherit',
                        borderRadius: '11px',
                        marginLeft: '6px'
                      }}
                    >
                      <Icon
                        size={18}
                        glyph="post"
                        title="Has a customized profile"
                      />
                      <span
                        style={{
                          margin: '0px 4px 0px 2px',
                          transform: 'translateY(2px)',
                          verticalAlign: 'middle'
                        }}
                      >
                        DRAFT
                      </span>
                    </span>
                  )}
                </span>
                <time className="post-header-date" dateTime={postedAt}>
                  {formatDate(postedAt)}
                </time>
              </section>
            </a>
          </Link>
          {!composing && (
            <section
              onClick={async () => {
                play()
                await fetch(`/api/clap?id=${id}`)
                mutate('/api/posts')
              }}
              style={{
                background: 'var(--colors-slate)',
                padding: '8px',
                borderRadius: '999px',
                paddingTop: '10px'
              }}
              className="clap"
            >
              👏
              <span style={{ marginLeft: '4px', marginRight: '3px' }}>
                {claps}
              </span>
            </section>
          )}
        </span>
      )}
      <b>{title}</b>
      <Content>{text}</Content>
      {collaborators && collaborators[0] && (
        <div style={{ color: 'var(--colors-muted)', display: 'inline-block' }}>
          with{' '}
          {collaborators.map((collab, index) => (
            <>
              <Link href={`/${collab}`}>
                <>@{collab}</>
              </Link>{' '}
              {collaborators[index + 1] && (
                <>{collaborators[index + 2] ? ',' : '&'}</>
              )}
            </>
          ))}
        </div>
      )}
      {(attachments.length > 0 || mux.length > 0) && (
        <div className="post-attachments">
          {filter(attachments, a =>
            typeof a === 'string' ? a.startsWith('data:image') : false
          ).map(img => (
            <a key={img} href={img} target="_blank" className="post-attachment">
              <img key={img} src={img} />
            </a>
          ))}
          {filter(attachments, a => endsWithAny(imageFileTypes, a)).map(img => (
            <a
              key={img}
              href={img}
              target="_blank"
              title={img}
              className="post-attachment"
            >
              <img key={img} alt={img} src={img} loading="lazy" title={img} />
            </a>
          ))}
          {filter(attachments, a => endsWithAny(audioFileTypes, a)).map(aud => (
            <audio
              key={aud.url}
              className="post-attachment"
              src={aud.url}
              controls
              preload="metadata"
            />
          ))}
          {mux.map(id => (
            <Video key={id} mux={id} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Post
