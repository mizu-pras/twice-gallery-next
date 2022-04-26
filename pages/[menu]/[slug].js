import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import styles from '../../styles/Gallery.module.css'

const Slug = () => {
    const router = useRouter()
    const { menu, slug } = router.query

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
                        setData(data.data)
                        setPage(data.page)
                        setTotalPage(data.totalPage)
                    })
                    .catch(err => {
                        console.error(err)
                    })
            }
    
            fetchData()
        }
    }, [menu, slug, page])

    return (
        <div>
            {menu}
            {slug}
        </div>
    )
}

export default Slug