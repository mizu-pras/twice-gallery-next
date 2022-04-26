import { useEffect, useState } from 'react'
import styles from '../../styles/Gallery.module.css'

const Slug = ({ data, page, totalPage }) => {
    const [dataShow, setDataShow] = useState([])

    useEffect(() => {
        setDataShow(prev => [...prev, ...data])
    }, [data])

    return (
        <div>
            
        </div>
    )
}

export async function getServerSideProps(context) {
    const { menu, slug } = context.query

    const url = process.env.USE_HOSTNAME

    const res = await fetch(`${url}/api/${menu}/${slug}`)
    const data = await res.json()
  
    if (!data.data) {
        return {
            notFound: true,
        }
    }
  
    return {
        props: {
            data: data.data,
            page: data.page,
            totalPage: data.totalPage
        }
    }
}

export default Slug