import { AnimatePresence } from 'framer-motion'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <AnimatePresence exitBeforeEnter initial={true}>
      <Component {...pageProps} />
    </AnimatePresence>
  )
}

export default MyApp
