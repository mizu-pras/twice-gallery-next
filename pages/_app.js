import dynamic from 'next/dynamic'
const ProgressBar = dynamic(() => import('../components/ProgessBar'), { ssr: false })

import { AactiveMenuWrapper } from '../context/activeMenu'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
	return (
		<>
			<AactiveMenuWrapper>
				<Component {...pageProps} />
			</AactiveMenuWrapper>

			<ProgressBar />
		</>
	)
}

export default MyApp
