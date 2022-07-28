import prisma from '../../lib/prisma'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export default function Judging({ update }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '24px', maxWidth: '600px', margin: 'auto' }}>
        {update.text}
      </p>
      <p
        style={{
          fontSize: '18px',
          maxWidth: '600px',
          margin: 'auto',
          color: 'var(--colors-blue)',
          marginBottom: '8px'
        }}
      >
        @{update.Accounts.username}
      </p>
      <img
        src={update.attachments[0]}
        style={{ borderRadius: '8px', height: '300px', marginBottom: '8px' }}
      />
      <br />
      <div style={{margin: '20px'}}>
        <span
          onClick={async () => {
            play()
            await fetch(`/api/clap?id=${id}`)
            mutate('/api/posts')
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px'
          }}
          className="clap"
        >
          👏
          <span style={{ marginLeft: '4px', marginRight: '3px' }}>1</span>
        </span>
      </div>
      <div className="emojiWrap">
        <Picker data={data} onEmojiSelect={console.log} />
      </div>
      <style>{`
      .emojiWrap > div > em-emoji-picker {
        margin: auto
      }
      `}</style>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  let update = await prisma.updates.findFirst({
    where: {
      id: ctx.params.id
    },
    include: {
      Accounts: true,
      reactions: true
    }
  })
  let emojis = await fetch('http://badger-zeta.vercel.app/api/emoji').then(r =>
    r.json()
  )
  return { props: { update, emojis } }
}
