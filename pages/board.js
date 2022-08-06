import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function HackBoard() {
  let amount = 20
  const { data, error } = useSWR('/api/board', fetcher)
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr);' }}>
        {[...Array(amount).keys()].map(x => (
          <div
            style={{
              height: '10vh',
              position: 'relative', 
              display: data ? data[x]?.url ? 'block' : 'none' :'none'
            }}
          >
            {data && (
              <div
                style={{
                  width: 'calc(100vw / 15)',
                  height: '10vh',
                  objectFit: 'cover'
                }}
              >
                <small
                  style={{
                    position: 'absolute',
                    top: 5,
                    left: 5,
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '8px',
                    padding: '0px 4px',
                    maxWidth: 'calc(100vw / 15 - 8px)',
                    wordWrap: 'break-word',
                    display: data ? data[x]?.username ? 'block' : 'none' :'none'
                  }}
                >
                  @{data[x]?.username}
                </small>
                <img
                  src={data[x]?.url}
                  style={{
                    width: 'calc(100vw / 15)',
                    height: '10vh',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <style>
        {`.nav {
          display: none!important
        }`}
      </style>
    </>
  )
}
