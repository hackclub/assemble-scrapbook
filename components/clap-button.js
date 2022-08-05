import { useState } from "react"

const ClapButton = ({ id, initialClaps }) => {
  const [clapCount, setClapCount] = useState(initialClaps)

  const handleClick = async () => {
    // increment UI
    setClapCount(clapCount + 1)
    // play audio
    new Audio(`/api/sound?id=${id}`).play()
    // send request
    await fetch(`/api/clap?id=${id}`)
  }

  return (
    <section onClick={handleClick}
      style={{
        userSelect: 'none',
        cursor: 'pointer',
        background: 'var(--colors-slate)',
        padding: '8px',
        paddingRight: '11px',
        borderRadius: '999px',
        paddingTop: '10px'
      }}
      className="clap"
    >
      👏&nbsp;{clapCount}
    </section>
  )
}
export default ClapButton