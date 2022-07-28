import prisma from '../../lib/prisma'
import FormData from 'form-data';
const { Readable } = require("stream")

const share = async req => {
  try {
    const data = JSON.parse(req.body)
    const { image, description, id } = data
    let form = new FormData()
    form.append('file', Readable.from(Buffer.from(image.split(',')[1] ?? '', 'base64')), `image.${image.substring("data:image/".length, image.indexOf(";base64"))}`)
    const uploadResp = await fetch('https://bucky.hackclub.com', {
      method: 'POST',
      body: form
    })
    const uploadedUrl = await uploadResp.text()
    const cdnResp = await fetch('https://cdn.hackclub.com/api/new', {
      method: 'POST',
      body: JSON.stringify([uploadedUrl])
    })
    const cdnUrl = (await cdnResp.json())[0]
    console.log('uploaded url', cdnUrl)
    await prisma.updates.create({
      data: {
        text: description,
        attachments: [cdnUrl],
        accountID: id,
        isShip: req.query?.ship == "true" ? true : false
      }
    })
    return { ok: true, error: null }
  } catch (error) {
    console.log(error)
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
