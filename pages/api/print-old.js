import fetch from 'node-fetch'

const SLACK_TOKEN = process.env.SLACK_TOKEN
const CHANNEL = 'C0P5NE354'

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const printFile = `https://scrapbook.assemble.hackclub.com/api/numbered-post-image/${req.params.id}`
  await fetch('https://slack.com/api/chat.postMessage', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${SLACK_TOKEN}`
    },
    body: JSON.stringify({
      channel: CHANNEL,
      text: `please print this file and react once it's finished: ${printFile}`
    })
  })
  res.json({ success: true })
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}
