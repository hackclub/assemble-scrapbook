import React from 'react'

import '../public/fonts.css'
import '../public/app.css'
import '../public/cartridge.css'
import '../public/themes/default.css'
import Nav from '../components/nav'
import NProgress from '../components/nprogress'
import { SessionProvider } from "next-auth/react"

const App = ({ Component, pageProps: {session, ...pageProps} }) => (
  <>
    <SessionProvider session={session}>
      <Nav />
      <NProgress color={'#ec3750'} />
      <Component {...pageProps} />
    </SessionProvider>
  </>
)

export default App
