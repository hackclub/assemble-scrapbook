import prisma from '../../lib/prisma'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useState } from 'react'
import Cookies from 'cookies'

export default function Judging({ update, reaction, emojiArray, colorEmojis }) {
  const [emojiState, setEmojiState] = useState(0)
  const [selected, setSelected] = useState({
    1: reaction?.emoji[0] || 'Select An Emoji',
    2: reaction?.emoji[1] || 'Select An Emoji',
    3: reaction?.emoji[2] || 'Select An Emoji',
    4: reaction?.emoji[3] || 'Select An Emoji',
    5: reaction?.emoji[4] || 'Select An Emoji'
  })
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(true)
  function upload(selectedToUse) {
    setSaved(false)
    setLoaded(false)
    fetch(`/api/judge?update=${update.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emoji: Object.values(selectedToUse).map(x => x.native || x.src || x)
      })
    }).then(r => {
      setSaved(true)
      setLoaded(true)
    })
  }
  return (
    <div style={{ textAlign: 'center' }}>
      {saved ? (
        <div
          style={{
            background: '#1c7b52',
            padding: '8px',
            fontWeight: '800',
            position: 'fixed',
            top: 0,
            width: '100vw'
          }}
        >
          <h3>Emoji reactions saved!</h3>
        </div>
      ) : loaded ? (
        <div
          style={{
            background: 'var(--colors-red)',
            padding: '8px',
            fontWeight: '800',
            position: 'fixed',
            top: 0,
            width: '100vw'
          }}
        >
          <h3>Scrapbook @ Assemble</h3>
        </div>
      ) :  (
        <div
          style={{
            background: 'var(--colors-blue)',
            padding: '8px',
            fontWeight: '800',
            position: 'fixed',
            top: 0,
            width: '100vw'
          }}
        >
          <h3>Saving your reactions...</h3>
        </div>
      )}

      <img
        src={update.attachments[0]}
        width="100vw"
        style={{
          marginBottom: '12px',
          maxHeight: '300px',
          objectFit: 'cover',
          width: '100vw'
        }}
      />
      <h1>Select Up To Five Emojis To Describe The Project</h1>
      <div
        style={{
          margin: 'auto',
          display: 'grid',
          maxWidth: '500px',
          gridTemplateColumns: '1fr',
          fontSize: '32px',
          gap: '16px',
          marginTop: '8px',
          width: '90vw',
          position: 'relative'
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
            paddingTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="clap"
        >
          {selected[1].native ||
            ((selected[1].src || selected[1].includes('http')) && (
              <img src={selected[1].src || selected[1]} height="40px" />
            )) ||
            selected[1]}
        </span>
        <span
          onClick={async () => {
            setEmojiState(2)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="clap"
        >
          {selected[2].native ||
            ((selected[2].src || selected[2].includes('http')) && (
              <img src={selected[2].src || selected[2]} height="40px" />
            )) ||
            selected[2]}
        </span>
        <span
          onClick={async () => {
            setEmojiState(3)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="clap"
        >
          {selected[3].native ||
            ((selected[3].src || selected[3].includes('http')) && (
              <img src={selected[3].src || selected[3]} height="40px" />
            )) ||
            selected[3]}
        </span>
        <span
          onClick={async () => {
            setEmojiState(4)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="clap"
        >
          {selected[4].native ||
            ((selected[4].src || selected[4].includes('http')) && (
              <img src={selected[4].src || selected[4]} height="40px" />
            )) ||
            selected[4]}
        </span>
        <span
          onClick={async () => {
            setEmojiState(5)
          }}
          style={{
            background: 'var(--colors-slate)',
            padding: '8px',
            borderRadius: '20px',
            paddingTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="clap"
        >
          {selected[5].native ||
            ((selected[5].src || selected[5].includes('http')) && (
              <img src={selected[5].src || selected[5]} height="40px" />
            )) ||
            selected[5]}
        </span>
      </div>
      <div
        style={{
          position: 'fixed',
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
            upload({ ...selected, ...newData })
          }}
          custom={[
            {
              id: 'slack',
              name: 'Slack',
              emojis: [
               ...emojiArray
              ]
            },
            {
              id: 'slack-colors',
              name: 'Colors',
              emojis: [
                ...colorEmojis
              ]
            }
          ]}
        />
      </div><br />
      <style>{`
      .emojiWrap > div > em-emoji-picker {
        margin: auto
      }
      .nav {
        display: none!important
      }
      `}</style>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const cookies = new Cookies(ctx.req, ctx.res)
  console.log(cookies.get('assemble-judging'))
  let update = await prisma.updates.findFirst({
    where: {
      postNumber: parseInt(ctx.params.id)
    },
    include: {
      Accounts: true,
      reactions: true
    }
  })

  let reaction
  if (cookies.get('assemble-judging') !== undefined) {
    reaction = await prisma.reactions.findFirst({
      where: {
        cookie: cookies.get('assemble-judging')?.toString() ,
        updateId: update.id
      }
    })
  } else {
    reaction = null
  }
  let emojis = await fetch('http://badger-zeta.vercel.app/api/emoji').then(r =>
    r.json()
  )
  console.log(reaction)
  const colorEmojis = [];
   const emojiArray = (() => {
     const values = Object.values(emojis);
     return Object.keys(emojis).map((key, i) => {
       return {
         id: key.toLowerCase(),
         name: key,
         keywords: [key.toLowerCase(), ...key.split('_'), ...key.split('-')],
         skins: [
           {
             src: values[i]?.startsWith('alias:') ? emojis[values[i].substring(6)] : values[i]
           }
         ]
       };
     }).filter(key => {
       const filter = !(+key.name >= 0 && +key.name <= 200000 && key.name.length == 6) &&
       !(key.name.startsWith('color_')) &&
       !(key.name.startsWith('balloon_')) &&
       !(key.name.startsWith('p_'));
       if (!filter) colorEmojis.push(key); // push all of the color emojis to their own section
       return filter;
     })
   })();
   return { props: { update, emojis, reaction, emojiArray, colorEmojis } }
}
