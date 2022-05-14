import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Image.module.css'

const Images = ({ url, heightDummyImage }) => {
    const imageWrapper = useRef()
    const [loaded, setLoaded] = useState(false)
    const [natural, setNatural] = useState({
        naturalHeight: 1,
        naturalWidth: 1
    })
    const [newHeight, setNewHeight] = useState(0)

    const loadedHandler = (dataImage) => {
        setNatural(dataImage)
        setLoaded(true)
    }

    useEffect(() => {

        const n = natural.naturalHeight / natural.naturalWidth * heightDummyImage
        setNewHeight(n)

    }, [heightDummyImage, natural])

    return (
        <div>
            <div
                ref={imageWrapper}
                style={{ 
                    width: heightDummyImage+'px', 
                    height: newHeight ? newHeight+'px' : heightDummyImage+'px', 
                    position: 'relative',
                    style: 'none'
                }}
            >
                <Image
                    className={styles.img} 
                    src={url}
                    layout='fill'
                    alt=''
                    onLoadingComplete={loadedHandler}
                />

                { !loaded && <div className={styles.loadingImage}></div> }
            </div>
        </div>
    )
}

export default Images