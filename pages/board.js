import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function HackBoard() {
  let amount = 150
  const { data, error } = useSWR('/api/board', fetcher, { refreshInterval: 1000 })
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr);' }}>
        <h1 style={{position: 'absolute', bottom: 16, left: 16, fontSize: '72px', zIndex: '999'}}>scrapbook.assemble.hackclub.com</h1>
        {[...Array(amount).keys()].map(x => (
          <div
            style={{
              height: '15vh',
              position: 'relative', 
              display: data ? data[x]?.url ? 'block' : 'none' :'none'
            }}
          >
            {data && (
              <div
                style={{
                  width: 'calc(100vw / 7)',
                  height: '15vh',
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
                    maxWidth: 'calc(100vw / 7 - 8px)',
                    wordWrap: 'break-word',
                    display: data ? data[x]?.username ? 'block' : 'none' :'none'
                  }}
                >
                  @{data[x]?.username}
                </small>
                <img
                  src={data[x]?.url}
                  style={{
                    width: 'calc(100vw / 7)',
                    height: '15vh',
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
