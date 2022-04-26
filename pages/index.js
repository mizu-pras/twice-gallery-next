import { useState, useEffect } from 'react'
import Head from 'next/head'
import useWindowDimensions from '../hook/dimension'
import styles from '../styles/Home.module.css'

import HomeGallery from '../components/HomeGallery'

export default function Home({ menus }) {
	const [activeMenu, setACtiveMenu] = useState(menus[0])
	const [data, setData] = useState(null)
  	const [isLoading, setLoading] = useState(false)
	const [columnWidth, setColumnWidth] = useState()
	const { width, height } = useWindowDimensions()

	const fetchDataSlug = async () => {
		setLoading(true)
		setData([])

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

	useEffect(() => {
		fetchDataSlug()
	}, [activeMenu])

	const handlerSetColumnWidthAndHeight = () => {
		console.log('width', width, 'height', height)
		// if width >= 992px -> 3 kolom
		// else -> 2 kolom

		let perColumn
		if (width >= 992) {
			// kolom 3
			if (width >= 1200) {
				perColumn = (1200 - 56) / 3
			}
			else {
				perColumn = (width - 56) / 3
			}
			
		}
		else {
			// kolom 2
			perColumn = (width - 14) / 2
		}

		setColumnWidth(perColumn)
	}

	useEffect(() => {
		handlerSetColumnWidthAndHeight()
	}, [width, height])

	const renderHomeGallery = () => {
		if (!data) return null

		const columns = []
		if (width >= 992) {
			columns.push(data.filter((_, i) => i % 3 === 0))
            columns.push(data.filter((_, i) => i % 3 === 1))
            columns.push(data.filter((_, i) => i % 3 === 2))
        }
        else {
            columns.push(data.filter((_, i) => i % 2 === 0))
            columns.push(data.filter((_, i) => i % 2 === 1))
        }

		return (
			<div className={styles.homeGalleryContainer}>
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
			</main>
		</div>
	)
}

export async function getStaticProps(context) {
	const res = await fetch('http://localhost:3000/api/menus')
	const menus = await res.json()

	return {
	  props: {
		  menus
	  }
	}
}