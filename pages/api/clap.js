import prisma from '../../lib/prisma'
import FormData from 'form-data';
const { Readable } = require("stream")

const clap = async req => {
  try {
    const result = await prisma.updates.update({
      where: {
        id: req.query.id
      },
      data: {
        claps: {
          increment: 1
        }
      },
    })
    return { ok: true, error: null }
  } catch (error) {
    console.log(error)
    return { ok: false, error }
  }
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(await clap(req))
}
