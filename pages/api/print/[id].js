import fetch from 'node-fetch'

const SLACK_TOKEN = process.env.SLACK_TOKEN
const CHANNEL = 'C03SJ0S42Q4'

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const printFile = `https://scrapbook.assemble.hackclub.com/api/numbered-post-image/${req.query.id}`
  const result = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SLACK_TOKEN}`
    },
    body: JSON.stringify({
      channel: CHANNEL,
      text: `please print this file and react once it's finished: ${printFile}`
    })
  })
  res.json({ success: true })
}
