import prisma from '../../lib/prisma'
const share = async req => {
  try {
    const data = JSON.parse(req.body)
    const { image, description, id } = data
    await prisma.updates.create({
      data: {
        text: description,
        attachments: [image],
        accountID: id
      }
    })
    return { ok: false, error: null }
  } catch (error) {
    return { ok: false, error }
  }
}

export default async (req, res) => {
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
