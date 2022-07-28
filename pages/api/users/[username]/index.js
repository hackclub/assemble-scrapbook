import { map, find, isEmpty, orderBy } from 'lodash'
import { getRawUsers } from '../index'
import { getRawPosts, transformPost } from '../../posts'
import prisma from '../../../../lib/prisma'

export const getProfile = async (value, field = 'username') => {
  let where = {}
  where[field] = value
  const opts = {
    where
  }
  const user = await prisma.account.findFirst(opts)
  if (!user) console.error('Could not fetch account', value)
  return user && user?.username ? user : {}
}

export const getPosts = async user => {
  const allUpdates = await getRawPosts(null, {
    where: {
      OR: [{
        Accounts: { username: user.username }},
        {collaborators: {
          has: user.username,
        },
      }]
    }
  })

  if (!allUpdates) console.error('Could not fetch posts')
  return allUpdates.map(p => transformPost(p))
}

export default async (req, res) => {
  const profile = await getProfile(req.query.username, 'username')
  if (!profile?.id)
    return res.status(404).json({ status: 404, error: 'Cannot locate user' })
  let webring = []
  if (profile.webring) {
    webring = await Promise.all(
      profile.webring.map(async id => await getProfile(id, 'slackID'))
    )
  }
  const posts = (await getPosts(profile)) || []
  res.json({ profile, webring, posts })
}
