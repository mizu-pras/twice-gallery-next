import { useState, useEffect } from 'react'
import Head from 'next/head'
import useWindowDimensions from '../hook/dimension'
import styles from '../styles/Home.module.css'

import HomeGallery from '../components/HomeGallery'

export default function Home({ menus }) {
	const [activeMenu, setACtiveMenu] = useState(menus[0])
	const [data, setData] = useState(null)
	const [start, setStart] = useState(1)
  	const [isLoading, setLoading] = useState(false)
	const { width, height } = useWindowDimensions()

	const fetchDataSlug = async () => {
		setLoading(true)
		setStart(0)

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
				setData([])
				setLoading(false)
			})
	}

	useEffect(() => {
		fetchDataSlug()
	}, [activeMenu])

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

					{ isLoading && <span>Loading</span> }

					<div className={styles.homeGalleryContainer}>
					{
						data?.slice(start, start + 5)?.map((item, index) => {
							return <HomeGallery key={index} data={item} />
						})
					}
					</div>
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