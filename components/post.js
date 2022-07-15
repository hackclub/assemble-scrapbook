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
  return `${dayName}, ${date.getHours()}:${date.getMinutes()}`
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

const Post = ({
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
  slackUrl,
  muted = false,
  composing
}) => (
  <section
    className="post"
    id={id}
    style={muted ? { opacity: muted, pointerEvents: 'none' } : null}
  >
    {profile || !user ? (
      <header className="post-header">
        <time className="post-header-date" dateTime={postedAt}>
              {formatDate(postedAt)}
            </time>
      </header>
    ) : (
      <Link href="/[profile]" as={`/${user.username}`} prefetch={false}>
        <a className="post-header">
          <Image
            loading="lazy"
            src={user.avatar || emailToPfp(user.email)}
            width={48}
            height={48}
            alt={user.username}
            className="post-header-avatar"
          />

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
              {composing && 
                <span className="composing-tag" style={{ color: '#edc71f' }}>
                  <Icon
                    size={24}
                    glyph="post"
                    title="Has a customized profile"
                  />
                </span>
              }
            </span>
            <time className="post-header-date" dateTime={postedAt}>
              {formatDate(postedAt)}
            </time>
          </section>
        </a>
      </Link>
    )}
    <Content>{text}</Content>
    {text && <Cartridges text={text} />}
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
    {reactions.length > 0 && !profile && (
      <footer className="post-reactions" aria-label="Emoji reactions">
        {reactions.map(reaction => (
          <Reaction key={id + reaction.name} {...reaction} />
        ))}
      </footer>
    )}
  </section>
)

export default Post
