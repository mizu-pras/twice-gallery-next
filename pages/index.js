import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import useWindowDimensions from '../hook/dimension'
import { useActiveMenuContext } from '../context/activeMenu'
import styles from '../styles/Home.module.css'

import HomeGallery from '../components/HomeGallery'
import Footer from '../components/Footer'

export default function Home() {
	const [menus, setMenus] = useState([])
	const {activeMenu, setActiveMenu} = useActiveMenuContext()
	const [data, setData] = useState(null)
	const [isInit, setIsInit] = useState(true)
	const [isLoading, setLoading] = useState(false)
	const [columnWidth, setColumnWidth] = useState(0)
	const [containerHeight, setContainerHeight] = useState(0)
	const { view, width, height } = useWindowDimensions()

	useEffect(() => {
		fetch('api/menus')
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				throw new Error('Something went wrong')
			})
			.then((data) => {
				setMenus(data)

				if (!activeMenu) {
					setActiveMenu(data[0])
				}
				
				setIsInit(false)
			})
			.catch(err => {
				console.error(err)
				setIsInit(false)
			})
	}, [])

	useEffect(() => {
		if (activeMenu) {
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
	}, [activeMenu])

	useEffect(() => {
		if (data && data.length > 0) {
			const handlerSetColumnWidthAndHeight = () => {
				console.log('width', width, 'height', height)
		
				let perColumn
				let totalRow
				if (view === 'lg') {
					if (width >= 1200) {
						perColumn = (1200 - 56) / 4
					}
					else {
						perColumn = (width - 56) / 4
					}
					
					totalRow = Math.ceil(data.length / 4)
				}
				else if (view === 'md') {
					perColumn = (width - 56) / 3
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
				<title>TWICE Photo Collection</title>
				<meta name="description" content="TWICE Photo Collection" />
			</Head>

			{
				isInit ? (
					<div className={`layout ${styles.homeInitWrapper}`}>
						<p>Loading...</p>
					</div>
				) : (
					<>
						<main>
							<div className={styles.homeHeader}>
								<h1>TWICE <span className='subtitle'>Photo Collection</span></h1>
							</div>	

							<div className='layout'>
								<div className={styles.homeMenuWrapper}>
									{
										menus.map(menu => (
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

								{ isLoading && (
									<div className={styles.homeLoadingWrapper}>
										<span>Loading...</span>
									</div>
								) }
								
								<div 
									className={styles.homeGalleryContainer} 
									style={{ height: `${containerHeight}px` }}
								>
									{renderHomeGallery()}
								</div>
							</div>
						</main>

						<Footer />
					</>
				)
			}
		</div>
	)
}
