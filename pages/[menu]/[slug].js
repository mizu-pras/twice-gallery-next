import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import DefaultErrorPage from 'next/error'
import Head from "next/head"

import styles from '../../styles/Gallery.module.css'

const Slug = ({ dataFromServer }) => {
    const router = useRouter()
    const { menu, slug } = router.query

    const name = slug ? slug.replace(/(-)/g, ' ') : ''

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
                <title>{ name }</title>
                <meta name="description" content={`${menu} - ${ name }`} />

                <meta property="og:site_name" content={menu} />
                <meta property="og:url" content="https://twice-gallery.vercel.app"></meta>
				<meta property="og:image" content="https://kpopping.com/documents/12/4/800/Yes-I-am-Tzuyu-1st-Photobook-SCANS-documents-4(1).jpeg" />
            </Head>

            {menu}
            {slug}

            { page < totalPage && <button type="button" onClick={nextPageHandler}>Next Page</button> }
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