import { useRouter } from 'next/router'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import Meta from '@hackclub/meta'
import CalendarHeatmap from '@hackclub/react-calendar-heatmap'
import Icon from '@hackclub/icons'
import Banner from '../../components/banner'
import Message from '../../components/message'
import { StaticMention } from '../../components/mention'
import Post from '../../components/post'
import AudioPlayer from '../../components/audio-player'
import ExamplePosts from '../../components/example-posts'
import FourOhFour from '../404'
import { clamp } from 'lodash'
import { emailToPfp } from '../../lib/email'

const HOST =
  process.env.NODE_ENV === 'development' ? '' : 'https://scrapbook.hackclub.com'

const Tooltip = dynamic(() => import('react-tooltip'), { ssr: false })

// Calculate heatmap date range
const today = new Date()
const dateString = dt => dt.toISOString().substring(0, 10)
const heatmapEnd = dateString(today)
const heatmapStart = dateString(new Date(today.setDate(today.getDate() - 62)))

const Profile = ({
  profile = {},
  heatmap = [],
  webring = [],
  posts = [],
  children
}) => (
  <main className="container">
    <Meta
      as={Head}
      name="Hack Club Scrapbook"
      title={`@${profile.username}`}
      description={`Follow @${profile.username}’s progress ${
        profile.displayStreak && 0 < profile.streakCount
          ? `(currently a ${
              profile.streakCount <= 7 ? profile.streakCount : '7+'
            }-day streak!) `
          : ''
      }making things in the Hack Club community.`}
      image={`https://workshop-cards.hackclub.com/@${
        profile.username
      }.png?brand=Scrapbook${
        profile.avatar ? `&images=${profile.avatar}` : ''
      }&caption=${
        profile.displayStreak && 0 < profile.streakCount
          ? profile.streakCount <= 7
            ? profile.streakCount + '-day streak'
            : '7%2b day streak'
          : ''
      }`}
    />
    {profile.cssURL && (
      <link
        rel="stylesheet"
        type="text/css"
        href={HOST + `/api/css?url=${profile.cssURL}`}
      />
    )}
    {children}
    <header className="header" style={{ textAlign: 'center', margin: 'auto' }}>
      <img
        src={profile.avatar || emailToPfp(profile.email)}
        key={profile.avatar}
        width={96}
        height={96}
        alt={profile.username}
        className="header-title-avatar"
      />
      <section>
        <h1 className="header-title-name">@{profile.username}</h1>
        <h4 className="header-pronouns" style={{
          margin: '10px 0px'
        }}>{profile.pronouns}</h4>
        <div className="header-content">
          <div className="header-links">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                className="header-link header-link-github"
              >
                <Icon size={32} glyph="github" />
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                className="header-link header-link-website"
              >
                <Icon size={32} glyph="link" />
              </a>
            )}
          </div>
        </div>
      </section>
    </header>
    <article className="posts">
      {posts.map(post => (
        <Post key={post.id} user={profile} profile {...post} />
      ))}
      {posts.length === 1 && <ExamplePosts />}
    </article>
    {profile.cssURL && (
      <footer className="css" title="External CSS URL">
        <Icon
          glyph="embed"
          size={32}
          className="css-icon"
          aria-label="Code link icon"
        />
        <a
          href={
            profile.cssURL.includes('gist.githubusercontent')
              ? profile.cssURL
                  .replace('githubusercontent.', 'github.')
                  .split('/raw')?.[0]
              : profile.cssURL
          }
          target="_blank"
          className="css-link"
        >
          CSS:{' '}
          {profile.cssURL.includes('gist.githubusercontent')
            ? `Gist by @${profile.cssURL.split('.com/')?.[1]?.split('/')?.[0]}`
            : profile.cssURL}
        </a>
      </footer>
    )}
  </main>
)

const fetcher = url => fetch(url).then(r => r.json())

const Page = ({ username = '', router = {}, initialData = {} }) => {
  const { data, error } = useSWR(`/api/users/${username}/`, fetcher, {
    fallbackData: initialData,
    refreshInterval: 5000
  })
  if (!data) {
    return <Message text="Loading…" />
  } else if (error && !data) {
    return <Message text="Error" color1="orange" color2="pink" />
  } else {
    return (
      <Profile {...data}>
        <Banner isVisible={router.query.welcome === 'true'}>
          Woah!!! We’re communicating via a website now…welcome to your
          scrapbook page!
          <br />
          Did you know you can{' '}
          <a href="https://scrapbook.hackclub.com/msw" target="_blank">
            customize your scrapbook profile
          </a>
          ?
          <br />
          <a
            href="https://app.slack.com/client/T0266FRGM/C015M6U6JKU"
            target="_blank"
          >
            Join the #scrapbook-css channel
          </a>{' '}
          to see how.
        </Banner>
      </Profile>
    )
  }
}

const UserPage = props => {
  const router = useRouter()

  if (router.isFallback) {
    return <Message text="Loading…" />
  } else if (props.profile?.username) {
    return (
      <Page
        username={props.profile.username}
        router={router}
        initialData={props}
      />
    )
  } else {
    return <FourOhFour />
  }
}

export default UserPage

export const getStaticPaths = async () => {
  const { getUsernames } = require('../api/usernames')
  let usernames = await getUsernames({
    take: 75
  })
  const paths = usernames.map(username => ({ params: { username } }))
  return { paths, fallback: true }
}

export const getStaticProps = async ({ params }) => {
  const { getProfile, getPosts } = require('../api/users/[username]/index')
  if (params.username?.length < 2)
    return console.error('No username') || { props: {} }

  const profile = await getProfile(params.username)
  if (!profile || !profile?.username)
    return console.error('No profile') || { props: {} }

  try {
    const posts = await getPosts(profile)
    return {
      props: { profile, posts },
      revalidate: 1
    }
  } catch (error) {
    console.error(error)
    return { props: { profile }, revalidate: 1 }
  }
}
