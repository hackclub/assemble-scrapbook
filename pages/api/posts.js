import { find, compact, isEmpty } from 'lodash'
import { getRawUsers } from './users'
import { stripColons } from '../../lib/emoji'
import prisma from '../../lib/prisma'

export const getRawPosts = async (max = null, params = {}) => {
  const opts = {
    orderBy: {
      postTime: 'desc'
    },
    ...params
  }
  if (max) opts.take = max
  return await prisma.updates.findMany(opts)
}

export const formatTS = ts => (ts ? new Date(ts * 1000).toISOString() : null)

export const transformReactions = (raw = []) =>
  compact(
    raw.map(emoji => {
      try {
        const { name, emojiSource } = emoji.EmojiType
        if (name === 'aom') return null
        const obj = { name }
        obj[emojiSource.startsWith('http') ? 'url' : 'char'] = emojiSource
        return obj
      } catch (e) {
        return null
      }
    })
  )

export const transformPost = p => ({
  id: p.id,
  user: p.user ? p.user : {},
  timestamp: null,
  slackUrl: null,
  postedAt: p.postTime,
  text: p.text != null ? p.text : '',
  attachments: p.attachments,
  mux: p.muxPlaybackIDs,
  reactions: []
})

export const getPosts = async (max = null) => {
  const users = await getRawUsers(true)
  return await getRawPosts(max).then(posts =>
    posts
      .map(p => {
        p.user = find(users, { id: p.accountID }) || {}
        return p
      })
      .map(p => transformPost(p))
  )
}

export default async (req, res) => {
  const posts = await getPosts(req.query.max ? Number(req.query.max) : 200)
  return res.json(posts)
}
