import { useEffect, useState, Fragment } from "react"
import Link from 'next/link'
import { useRouter } from "next/router"
import DefaultErrorPage from 'next/error'
import Head from "next/head"

import styles from '../../styles/Gallery.module.css'

import RenderImage from '../../components/RenderImage'
import Footer from "../../components/Footer"

const Slug = ({ dataFromServer }) => {
    const router = useRouter()
    const { menu, slug } = router.query

    const name = menu ? menu.charAt(0).toUpperCase() + menu.slice(1) : ''
    const title = slug ? slug.replace(/(-)/g, ' ') : ''

    const [data, setData] = useState(dataFromServer.data)
    const [page, setPage] = useState(dataFromServer.page)
    const [totalPage, setTotalPage] = useState(dataFromServer.totalPage)

    const [getNextPage, setGetNextPage] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (getNextPage) {
            const nextPageHandler = () => {
                if (page < totalPage && !loading) {
                    setPage(prev => prev + 1)
                }
                else {
                    console.log('loading')
                }
            }

            setGetNextPage(false)

            nextPageHandler()
        }
    }, [getNextPage])

    useEffect(() => {
        console.log('current page', page)
        if (page > 1) {
            console.log('only fetch if page > 1')
            fetchNextPage()
        }
    }, [page])

    const fetchNextPage = () => {
        setLoading(true)

        fetch(`/api/${menu}/${slug}/${page}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Something went wrong')
            })
            .then((result) => {
                setData(prev => [...prev, ...result.data])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    if (data.length === 0) {
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
                        <Link href='/' passHref={true}>
                            <div className={styles.homeButton}>
                                <svg 
                                    stroke="currentColor" 
                                    fill="currentColor" 
                                    strokeWidth="0" 
                                    viewBox="0 0 512 512" 
                                    height="1em" 
                                    width="1em" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        fill="none" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="32" 
                                        d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212">
                                    </path>
                                    <path 
                                        fill="none" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="32" 
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
                    <RenderImage 
                        data={data} 
                        setGetNextPage={setGetNextPage}
                    />
                </div>

            </div>

            <div style={{ marginTop: '4rem' }}>
                <Footer />
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { menu, slug } = context.query
    const url = process.env.USE_HOSTNAME + `/api/${menu}/${slug}`

    const res = await fetch(url)
    const data = await res.json()
    
    if (!data.data) {
        return {
            props: {
                dataFromServer: {
                    data: [],
                    page: 1,
                    totalPage: 0,
                }
            }
        }
    }


    return {
        props: {
            dataFromServer: data
        }, // will be passed to the page component as props
    }
}

export default Slug