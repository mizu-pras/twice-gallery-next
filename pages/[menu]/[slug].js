import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import DefaultErrorPage from 'next/error'
import Head from "next/head"

import styles from '../../styles/Gallery.module.css'

const Slug = () => {
    const router = useRouter()
    const { menu, slug } = router.query

    const name = slug ? slug.replace(/(-)/g, ' ') : ''

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
                    .then((data) => {
                        if (page === 1 && !data.data) {
                            setIsNotFound(true)
                            return
                        }

                        setData(data.data)
                        setPage(data.page)
                        setTotalPage(data.totalPage)
                    })
                    .catch(err => {
                        console.error(err)
                        if (page === 1 && !data.data) {
                            setIsNotFound(true)
                        }
                    })
            }
    
            fetchData()
        }
    }, [menu, slug, page])

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