import { Readable } from 'stream'
import prisma from '../../lib/prisma'
const share = async req => {
  const data = JSON.parse(req.body)
  /* okay sweet, let's post the request body in slack */
  const { image, description, id } = data
  await prisma.updates.create({
    data: {
      text: description,
      attachments: ['https://github.com/hackclub.png'],
      accountID: id
    }
  })
  console.log(id)
  return { ok: true, error: `` }
}

export default async (req, res) => {
  // TODO: ensure this is a POST or OPTIONS request
  res.setHeader('Access-Control-Allow-Origin', '*')

  res.json(await share(req))
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}