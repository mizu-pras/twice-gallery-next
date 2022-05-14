import { useState, useEffect, useRef, Fragment } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import useWindowDimensions from '../hook/dimension'
import { useActiveMenuContext } from '../context/activeMenu'
import styles from '../styles/Home.module.css'

import HomeGallery from '../components/HomeGallery'
import Footer from '../components/Footer'

export default function Home({ menus }) {
	const {
		activeMenu, 
		setActiveMenu,
	} = useActiveMenuContext()

	const [data, setData] = useState(null)
	const [isInit, setIsInit] = useState(false)
	const [isLoading, setLoading] = useState(false)
	const [columnWidth, setColumnWidth] = useState(0)

	const [containerHeight, setContainerHeight] = useState(0)
	const [containerMinHeight, setContainerMinHeight] = useState(0)
	
	const { view, width, height } = useWindowDimensions()

	const homeGalleryContainerRef = useRef()

	useEffect(() => {
		const rect = homeGalleryContainerRef.current.getBoundingClientRect()
		let offsetTop = rect.top + window.scrollY
		if (view === 'sm') {
			offsetTop -= 42
		}
		else {
			offsetTop -= 56
		}

		const scrollHeight = document.body.clientHeight
		const posBottom = rect.bottom
		
		const offsetBottom = scrollHeight - posBottom
		if (view === 'sm') {
			offsetBottom += 42
		}
		else {
			offsetBottom += 56
		}

		console.log('scrollHeight', scrollHeight)
		console.log('offsetBottom', offsetBottom)

		// sm - 3rem => 42
		// lg - 4rem => 56

		setContainerMinHeight(`calc(100vh - ${offsetTop}px - ${offsetBottom}px)`)

	}, [view])

	useEffect(() => {
		if (activeMenu && activeMenu.path) {
			const fetchDataSlug = async () => {
				setLoading(true)
				setData([])
				setContainerHeight(0)
		
				fetch(`api/${activeMenu.path}`)
					.then((res) => {
						if (res.ok) {
							return res.json();
						}
						throw new Error('Something went wrong')
					})
					.then((data) => {
						setData(data)
						setLoading(false)
					})
					.catch(err => {
						setLoading(false)
					})
			}
	
			fetchDataSlug()
		}
		else {
			setActiveMenu(menus[0])
		}
	}, [activeMenu])

	useEffect(() => {
		if (data && data.length > 0) {
			const handlerSetColumnWidthAndHeight = () => {
				console.log('width', width, 'height', height)
		
				let perColumn
				let totalRow
				if (view === 'lg') {
					if (width >= 1500) {
						perColumn = (1500 - 56) / 4
					}
					else {
						perColumn = (width - 56) / 4
					}
					
					totalRow = Math.ceil(data.length / 4)
				}
				else if (view === 'md') {
					perColumn = (width - 28) / 3
					totalRow = Math.ceil(data.length / 3)
				}
				else {
					perColumn = width / 2
					totalRow = Math.ceil(data.length / 2)
				}
		
				setColumnWidth(perColumn)
				setContainerHeight(perColumn * totalRow)
				 
			}
			
			handlerSetColumnWidthAndHeight()
		}
	}, [width, height, view, data])

	const renderHomeGallery = () => {
		if (!data || data.length === 0) return null

		const columns = []
		if (view === 'lg') {
			columns.push(data.filter((_, i) => i % 4 === 0))
            columns.push(data.filter((_, i) => i % 4 === 1))
            columns.push(data.filter((_, i) => i % 4 === 2))
			columns.push(data.filter((_, i) => i % 4 === 3))
        }
		else if (view === 'md') {
			columns.push(data.filter((_, i) => i % 3 === 0))
            columns.push(data.filter((_, i) => i % 3 === 1))
            columns.push(data.filter((_, i) => i % 3 === 2))
        }
        else {
            columns.push(data.filter((_, i) => i % 2 === 0))
            columns.push(data.filter((_, i) => i % 2 === 1))
        }

		return (
			<motion.div 
				initial={{ opacity: 0, x: 0, y: 10 }}
				animate={{ opacity: 1, x: 0, y: 0 }}
				transition={{ 
					duration: 0.2,  
					type: 'easeInOut'
				}}
			>
				{
					columns.map((column, i) => {
						return (
							<div key={i}>
								{
									column.map((item, y) => {
										return <HomeGallery 
													key={`${i}-${y}`} 
													data={item} 
													width={columnWidth} 
													menu={activeMenu.path}
													column={i}
													row={y}
												/>
									})
								}
							</div>
						)
					})
				}
			</motion.div>
		)
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>TWICE Gallery</title>
				<meta name="description" content="TWICE Photo Collection" />

				<meta property="og:title" content="TWICE Gallery" />
				<meta property="og:description" content="The best photo collection of TWICE" />
				<meta property="og:type" content="article" />

				<meta property="og:site_name" content="Twice Gallery" />
				<meta property="og:url" content="https://twice-gallery.vercel.app/" />
				<meta property="og:image" content="https://kpopping.com/documents/12/4/800/Yes-I-am-Tzuyu-1st-Photobook-SCANS-documents-4(1).jpeg" />
			</Head>

			{
				isInit ? (
					<div className={`layout ${styles.homeInitWrapper}`}>
						<p>Loading...</p>
					</div>
				) : (
					<Fragment>
						<main>
							<div className={styles.homeHeader}>
								<h1>TWICE <span className='subtitle'>Gallery</span></h1>
							</div>	

							<div className='layout'>
								<div className={styles.homeMenuWrapper}>
									{
										menus && menus.map(menu => (
											<button 
												key={menu.path}
												type='button' 
												className={`${styles.buttonMenu}${activeMenu.path === menu.path ? ' ' + styles.buttonMenuActive : ''}`}
												onClick={() => setActiveMenu(menu)}
											>
												{menu.name}
											</button>
										))
									}
								</div>

								{ /* isLoading && (
									<div className={styles.homeLoadingWrapper}>
										<span>Loading...</span>
									</div>
								) */ }
								
								<div 
									ref={homeGalleryContainerRef}
									className={styles.homeGalleryContainer} 
									style={{ 
										height: `${containerHeight}px`,
										minHeight: containerMinHeight
									}}
								>
									{renderHomeGallery()}
								</div>
							</div>
						</main>

						<Footer />
					</Fragment>
				)
			}
		</div>
	)
}

export async function getServerSideProps(context) {
	const url = process.env.USE_HOSTNAME + '/api/menus'

	const res = await fetch(url)
    const data = await res.json()

	return {
		props: {
			menus: data
		}
	}
}
