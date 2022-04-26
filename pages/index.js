import { useState, useEffect } from 'react'
import Head from 'next/head'
import useWindowDimensions from '../hook/dimension'
import styles from '../styles/Home.module.css'

import HomeGallery from '../components/HomeGallery'

export default function Home() {
	const [menus, setMenus] = useState([])
	const [activeMenu, setACtiveMenu] = useState(null)
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
				setACtiveMenu(data[0])
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
					perColumn = (1200 - 56) / 4
					totalRow = Math.ceil(data.length / 4)
				}
				else if (view === 'md') {
					perColumn = (width - 56) / 3
					totalRow = Math.ceil(data.length / 3)
				}
				else {
					perColumn = (width - 14) / 2
					totalRow = Math.ceil(data.length / 2)
				}
		
				setColumnWidth(perColumn)
				setContainerHeight(perColumn * totalRow)
				 
			}
			
			handlerSetColumnWidthAndHeight()
		}
	}, [width, height, view, data])

	const renderHomeGallery = () => {
		if (!data) return null

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
			<div className={styles.homeGalleryContainer} style={{ height: `${containerHeight}px` }}>
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
												column={i}
												row={y}
											/>
									})
								}
							</div>
						)
					})
				}
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>TWICE Photo Collection</title>
				<meta name="description" content="TWICE Photo Collection" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<div className={styles.homeHeader}>
					<h1>TWICE <span className='subtitle'>Photo Collection</span></h1>
				</div>	

				{
					isInit ? (
						<div className={`layout ${styles.homeInitWrapper}`}>
							<p>Loading...</p>
						</div>
					) : (
						<div className='layout'>
							<div className={styles.homeMenuWrapper}>
								{
									menus.map(menu => (
										<button 
											key={menu.path}
											type='button' 
											className={`${styles.buttonMenu}${activeMenu.path === menu.path ? ' ' + styles.buttonMenuActive : ''}`}
											onClick={() => setACtiveMenu(menu)}
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

							{renderHomeGallery()}
						</div>
					)
				}

				
			</main>
		</div>
	)
}
