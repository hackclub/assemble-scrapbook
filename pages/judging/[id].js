import prisma from '../../lib/prisma'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useState } from 'react'

export default function Judging({ update }) {
  const [emojiState, setEmojiState] = useState(0)
  const [selected, setSelected] = useState({
    1: '❓',
    2: '❓',
    3: '❓',
    4: '❓',
    5: '❓'
  })
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={update.attachments[0]}
        width="400px"
        style={{ marginBottom: '12px', borderRadius: '8px' }}
      />
      <h1>Select Up To Five Emojis To Describe XXX</h1>
      <div
        style={{
          margin: 'auto',
          display: 'grid',
          maxWidth: '500px',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          fontSize: '32px',
          gap: '16px',
          marginTop: '8px'
        }}
      >
        <span
          onClick={async () => {
            setEmojiState(1)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px'
          }}
          className="clap"
        >
          {selected[1].native || selected[1]}
        </span>
        <span
          onClick={async () => {
            setEmojiState(2)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px'
          }}
          className="clap"
        >
          {selected[2].native || selected[2]}
        </span>
        <span
          onClick={async () => {
            setEmojiState(3)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px'
          }}
          className="clap"
        >
          {selected[3].native || selected[3]}
        </span>
        <span
          onClick={async () => {
            setEmojiState(4)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px'
          }}
          className="clap"
        >
          {selected[4].native || selected[4]}
        </span>
        <span
          onClick={async () => {
            setEmojiState(5)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px'
          }}
          className="clap"
        >
          {selected[5].native || selected[5]}
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          height: '100vh',
          top: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: emojiState == 0 ? 'none' : 'flex',
          width: '100vw',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '100vh',
            top: 0,
            display: emojiState == 0 ? 'none' : 'flex',
            width: '100vw',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setEmojiState(0)}
        ></div>
        <Picker
          data={data}
          onEmojiSelect={emoji => {
            let newData = {}
            newData[emojiState] = emoji
            setSelected({ ...selected, ...newData })
            setEmojiState(0)
          }}
        />
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
