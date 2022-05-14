import { Fragment, useEffect, useState, useRef } from 'react'
import styles from '../styles/RenderImage.module.css'

import useWindowDimensions from '../hook/dimension'

import Images from './Images'

const RenderImage = ({ data, setGetNextPage }) => {
    const [dataColumns, setDataColumns] = useState([])
    const [heightDummyImage, setHeightDummyImage] = useState(0)

    const listInnerRef = useRef()
    const { view, width } = useWindowDimensions()

    useEffect(() => {
        const onScroll = () => {
            if (listInnerRef.current) {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop
                const winHeight = window.innerHeight
    
                const rect = listInnerRef.current.getBoundingClientRect();
                const offsetTop = rect.top + window.scrollY
    
                const { scrollHeight } = listInnerRef.current
                
                if (winScroll + winHeight >= offsetTop + scrollHeight) {
                    setGetNextPage(true)
                }
    
            }
        }
        
        window.addEventListener("scroll", onScroll)

        return () => {
            window.addEventListener("scroll", onScroll)
        }
    }, [])

    useEffect(() => {
        
        if (data && data.length > 0) {
            const columns = []

            if (view === 'sm') {
                columns.push(data.filter((_, i) => i % 2 === 0))
                columns.push(data.filter((_, i) => i % 2 === 1))
            }
            else if (view === 'md') {
                columns.push(data.filter((_, i) => i % 3 === 0))
                columns.push(data.filter((_, i) => i % 3 === 1))
                columns.push(data.filter((_, i) => i % 3 === 2))
            }
            else {
                columns.push(data.filter((_, i) => i % 4 === 0))
                columns.push(data.filter((_, i) => i % 4 === 1))
                columns.push(data.filter((_, i) => i % 4 === 2))
                columns.push(data.filter((_, i) => i % 4 === 3))
            }

            setDataColumns(columns)
        }

    }, [view, data])

    useEffect(() => {

        let heightByWidth = width <= 600 ? width / 2 : width > 1500 ? 1500 / 3 : width / 3
        if (view === 'lg') {
            if (width >= 1500) {
                heightByWidth = (1500 - 98) / 4
            }
            else {
                heightByWidth = (width - 98) / 4
            }
        }
        else if (view === 'md') {
            heightByWidth = (width - 56) / 3
        }
        else {
            heightByWidth = (width - 7) / 2
        }

        setHeightDummyImage(heightByWidth)   

    }, [width])

    return (
        <Fragment>
            <div 
                className={styles.galleryContainer}
                ref={listInnerRef}
            >
                {
                    dataColumns.map((column, idxCol) => {
                        return (
                            <div key={`container-col-${idxCol}`} className={styles.galleryWrapper}>
                                {
                                    column.map((img, idxRow) => (
                                        <Images 
                                            key={`col-${idxCol}-${idxRow}`} 
                                            url={img} 
                                            style={{ width: "100%" }}
                                            heightDummyImage={heightDummyImage}
                                        />
                                    ))
                                }
                            </div>
                        )
                    })
                }
            </div>
        </Fragment>
    )
}

export default RenderImage