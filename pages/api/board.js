import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  let data = await prisma.account.findMany({
    include: {
      updates: {
        orderBy: {
          postTime: 'desc'
        }
      }
    }
  })
  data = data.map(x => ({
    ...x,
    updates: [x.updates[0]]
  }))
  data = data.map(x => ({
    username: x.username,
    url: x.updates[0]?.attachments[0]
  }))
  res.json(data)
}
