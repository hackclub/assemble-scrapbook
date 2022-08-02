import React, { useState, useEffect } from 'react'

import '../public/fonts.css'
import '../public/app.css'
import '../public/cartridge.css'
import '../public/themes/default.css'
import Nav from '../components/nav'
import NProgress from '../components/nprogress'

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [authStatus, setAuthStatus] = useState({
    status: 'loading',
    data: {}
  });

  
  useEffect(() => {
    const getCookieValue = (name) => (
      document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
    )    
    fetch('/api/get-auth-state').then(response => response.text()).then(data => 
      setAuthStatus({
        status: data == 'TRUE' ? 'authed' : 'unauthed', 
        data: (authStatus.data && Object.keys(authStatus.data)?.length) ? authStatus.data : (
          getCookieValue('scrapbook_user_data_json') ? JSON.parse(getCookieValue('scrapbook_user_data_json')) : {}
        ) 
      })
    );
  }, []);

  function setAuthData (data) {
    setAuthStatus({ data, ...authStatus });
  }

  return (
    <>
      <Nav />
      <NProgress color={'#ec3750'} />
      <Component {...pageProps} authStatus={authStatus} authData={authStatus.data} setAuthData={setAuthData} />
    </>
  );
}

export default App
