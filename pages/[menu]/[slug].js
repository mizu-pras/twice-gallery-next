import { useEffect, useState, Fragment } from "react"
import Link from 'next/link'
import { useRouter } from "next/router"
import DefaultErrorPage from 'next/error'
import Head from "next/head"

import styles from '../../styles/Gallery.module.css'

const Slug = ({ dataFromServer }) => {
    const router = useRouter()
    const { menu, slug } = router.query

    const name = menu ? menu.charAt(0).toUpperCase() + menu.slice(1) : ''
    const title = slug ? slug.replace(/(-)/g, ' ') : ''

    const [isNotFound, setIsNotFound] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)

    useEffect(() => {
        console.log('run once')

        if (!dataFromServer.data) {
            setIsNotFound(true)
        }
        else {
            setData(dataFromServer.data)
            setPage(dataFromServer.page)
            setTotalPage(dataFromServer.totalPage)
        }
    }, [])

    useEffect(() => {
        console.log('current page', page)
        if (page > 1) {
            console.log('only fetch if page > 1')
            fetchNextPage()
        }
    }, [page])

    const nextPageHandler = () => {
        if (page < totalPage) {
            setPage(prev => prev + 1)
        }
    }

    const fetchNextPage = () => {
        fetch(`/api/${menu}/${slug}/${page}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Something went wrong')
            })
            .then((result) => {
                setData(prev => [...prev, ...result.data])
            })
            .catch(err => {
                console.error(err)
            })
    }

    if (isNotFound) {
        return <DefaultErrorPage statusCode={404} />
    }

    return (
        <div>
            <Head>
                <title>{ title }</title>
                <meta name="description" content={`${name} - ${ title }`} />

                {
                    dataFromServer.data && (
                        <Fragment>
                            <meta property="og:site_name" content={`Twice Gallery | ${name}`} />
                            <meta property="og:url" content={`https://twice-gallery.vercel.app/${menu}/${slug}`}></meta>
                            <meta property="og:image" content={dataFromServer.data[0]} />
                        </Fragment>
                    )
                }
            </Head>

            <div className="layout">
            
                <header className={styles.header}>
                    <div className={styles.homeButtonContainer}>
                        <Link href='/'>
                            <div className={styles.homeButton}>
                                <svg 
                                    stroke="currentColor" 
                                    fill="currentColor" 
                                    stroke-width="0" 
                                    viewBox="0 0 512 512" 
                                    height="1em" 
                                    width="1em" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        fill="none" 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round" 
                                        stroke-width="32" 
                                        d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212">
                                    </path>
                                    <path 
                                        fill="none" 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round" 
                                        stroke-width="32" 
                                        d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69">
                                    </path>
                                </svg>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>{ name }</h1>
                        <h2 className={styles.subTitle}>{ title }</h2>
                    </div>
                </header> 
                
                <div>
                    main
                </div>

            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { menu, slug } = context.query
    const url = process.env.USE_HOSTNAME + `/api/${menu}/${slug}`

    const res = await fetch(url)
    const data = await res.json()

    return {
        props: {
            dataFromServer: data
        }, // will be passed to the page component as props
    }
}

export default Slug