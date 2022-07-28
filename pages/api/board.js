import prisma from '../../lib/prisma'
const Mux = require('@mux/mux-node')

export default async function handler(req, res) {
  const { Video, Data } = new Mux(
    process.env.MUX_TOKEN_ID,
    process.env.MUX_TOKEN_SECRET
  )
  let data = await prisma.account.findMany({
    include: {
      updates: {
        orderBy: {
          postTime: 'desc'
        }
      }
    }
  })
  let streams = await Video.LiveStreams.list()
  let streamObject = {}
  streams.map(stream => {
    streamObject[stream.id] = stream
  })
  data = data.map(x => ({
    ...x,
    updates: [x.updates[0]],
    stream: streamObject[x.stream]
  }))
  data = data.map(x => ({
    username: x.username,
    url:
      x.stream?.status == 'active'
        ? `https://stream.mux.com/${x.stream?.playback_ids[0].id}.m3u8`
        : x.updates[0].attachments[0]
  }))
  res.json(data)
}
