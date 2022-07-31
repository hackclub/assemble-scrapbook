import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function HackBoard() {
  let amount = 20
  const { data, error } = useSWR('/api/board', fetcher)
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr);' }}>
        {[...Array(amount).keys()].map(x => (
          <div style={{ height: '10vh', position: 'relative' }}>
            {data &&
              data[x] &&
              (data[x].url.slice(-4) == 'm3u8' ? (
                <video
                  style={{
                    width: 'calc(100vw / 15)',
                    height: '10vh',
                    objectFit: 'cover'
                  }}
                  autoPlay
                  muted
                >
                  <source src={data[x].url} type="application/x-mpegURL" />
                </video>
              ) : (
                <div style={{
                  width: 'calc(100vw / 15)',
                  height: '10vh',
                  objectFit: 'cover'
                }}>
                  <small style={{position: 'absolute', top: 5, left: 5}}>@{data[x].username}</small>
                  <img
                    src={data[x].url}
                    style={{
                      width: 'calc(100vw / 15)',
                      height: '10vh',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
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
