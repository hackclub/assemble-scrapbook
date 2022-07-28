import prisma from '../../lib/prisma'
import Cookies from 'cookies'

export default async function handler(req, res) {
  const cookies = new Cookies(req, res)
  let random = Math.random()
  if (!cookies.get('assemble-judging')) {
    cookies.set('assemble-judging', random, {
      httpOnly: false
    })
  }
  let judging = await prisma.reactions.findFirst({
    where: {
      cookie: cookies.get('assemble-judging') || random,
      updateId: req.query.update
    }
  })
  if(judging == null){
    judging = await prisma.reactions.create({
      data: {
        cookie: cookies.get('assemble-judging') || random,
        updateId: req.query.update,
        emoji: req.body.emoji
      }
    })
    return res.json(judging)
  }
  else {
    judging = await prisma.reactions.update({
      where: {
        id: judging.id
      },
      data: {
        cookie: cookies.get('assemble-judging') || random,
        updateId: req.query.update,
        emoji: req.body.emoji
      }
    })
    return res.json(judging)
  }
}
