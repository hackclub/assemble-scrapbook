import { rest } from "lodash";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  let toJudge = await prisma.updates.findMany({
    include: {
      reactions: true
    }
  })
  toJudge = toJudge.map(x => {
    let reactions = {}
    x.reactions.map(reaction => {
      reaction.emoji.map(emoji => {
        if (reactions[emoji]) {
          reactions[emoji] += 1
        }
        else {
          reactions[emoji] = 1
        }
      })
    })
    return {
      title: x.title,
      attachments: x.attachments,
      reactions
    }
  })
  
  res.json(toJudge)
}