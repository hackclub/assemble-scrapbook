import { rest } from 'lodash'
import prisma from '../lib/prisma'

export default function Judging(props) {
  return (
    <>
      <h1 style={{ display: 'flex', padding: '32px' }}>Emoji-by-Emoji</h1>
      {Object.keys(props.allTheReactions).map(p => (
        <div key={p} style={{ display: 'flex', padding: '8px 32px' }}>
          <div style={{ fontSize: '50px', marginRight: '12px' }}>
            {p.includes('http') ? (
              <img src={p} height="50px" style={{ marginRight: '4px' }} />
            ) : (
              p
            )}
          </div>
          <div>
            {Object.keys(props.allTheReactions[p]).map(q => (
              <>
                <a href={`#${q}`} style={{ color: 'white!important' }}>
                  {q}
                </a>
                : {props.allTheReactions[p][q]}
              </>
            ))}
          </div>
        </div>
      ))}
      
      <h1 style={{ display: 'flex', padding: '32px' }}>Project-by-Project</h1>
      {props.toJudge.map(project => (
        <div key={project.id} style={{ display: 'flex', padding: '32px' }}>
          <img src={project.attachments[0]} height="250px" />
          <div style={{ paddingLeft: '16px' }}>
            <h1 id={project.id}>{project?.title || project.description}</h1>
            <h2>
              {project.makers.map((x, index) => (
                <>
                  {index != 0 && ', '}
                  {x}
                </>
              ))}
            </h2>
            <p>{project.text}</p>
            <br />
            <b>Reactions:</b>
            {Object.keys(project.reactions).map(x => (
              <div>
                {x.includes('http') ? (
                  <img src={x} height="10px" style={{ marginRight: '4px' }} />
                ) : (
                  x
                )}
                : {project.reactions[x]}<br />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export async function getServerSideProps(ctx) {
  if (ctx.query?.pw == process.env.password) {
    let toJudge = await prisma.updates.findMany({
      include: {
        reactions: true,
        Accounts: true,
        collaborators: true
      },
      where: {
        isShip: true
      }
    })
    let allTheReactions = {}
    toJudge = toJudge.map(x => {
      let reactions = {}
      x.reactions.map(reaction => {
        reaction.emoji.map(emoji => {
          if (reactions[emoji]) {
            reactions[emoji] += 1
          } else {
            reactions[emoji] = 1
          }
        })
      })
      Object.keys(reactions).map(z => {
        if (allTheReactions[z]) {
          allTheReactions[z][x.id] = reactions[z]
        } else {
          allTheReactions[z] = {}
          allTheReactions[z][x.id] = reactions[z]
        }
      })
      let makers = []
      makers.push(x.accountUsername)
      x.collaborators.map(y => {
        makers.push(y.accountUsername)
      })
      return {
        id: x.id,
        title: x.title,
        text: x.text,
        attachments: x.attachments,
        reactions,
        makers
      }
    })
    console.log(allTheReactions)
    return { props: { toJudge, allTheReactions } }
  } else {
    return { props: { toJudge: [], allTheReactions: {} } }
  }
}
