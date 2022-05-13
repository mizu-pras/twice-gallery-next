import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import DefaultErrorPage from 'next/error'
import Head from "next/head"

import styles from '../../styles/Gallery.module.css'

const Slug = () => {
    const router = useRouter()
    const { menu, slug } = router.query

    const name = slug ? slug.replace(/(-)/g, ' ') : ''

    const [pageLoading, setPageLoading] = useState(true)
    const [isNotFound, setIsNotFound] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)

    useEffect(() => {
        if (menu && slug) {
            const fetchData = () => {
                fetch(`/api/${menu}/${slug}`)
                    .then((res) => {
                        if (res.ok) {
                            return res.json();
                        }
                        throw new Error('Something went wrong')
                    })
                    .then((result) => {
                        if (page === 1 && !result.data) {
                            setIsNotFound(true)
                            setPageLoading(false)
                            return
                        }

                        setData(prev => [...prev, ...result.data])
                        setPage(result.page)
                        setTotalPage(result.totalPage)

                        setPageLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        if (page === 1) {
                            setIsNotFound(true)
                            setPageLoading(false)
                        }
                    })
            }
    
            fetchData()
        }
    }, [menu, slug, page])

    if (pageLoading) {
        return <div><p>Loading...</p></div>
    }

    if (isNotFound) {
        return <DefaultErrorPage statusCode={404} />
    }

    return (
        <div>
            <Head>
                <title>{ name }</title>
                <meta name="description" content={`TWICE Photo Collection - ${ name }`} />
            </Head>

            {menu}
            {slug}
        </div>
    )
}

export default Slug