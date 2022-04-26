import { AactiveMenuWrapper } from '../context/activeMenu'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <AactiveMenuWrapper>
      <Component {...pageProps} />
    </AactiveMenuWrapper>
  )
}

export default MyApp
