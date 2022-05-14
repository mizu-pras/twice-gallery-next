import { useState, useRef } from 'react'
import Image from 'next/image'
import styles from '../styles/Image.module.css'

const Images = ({ url, heightDummyImage }) => {
    const imageWrapper = useRef()
    const [loaded, setLoaded] = useState(false)

    const loadedHandler = (dataImage) => {
        const { naturalHeight, naturalWidth } = dataImage

        const newHeight = naturalHeight / naturalWidth * heightDummyImage

        if (imageWrapper.current) {
            imageWrapper.current.style.height = newHeight + 'px'
        }

        setLoaded(true)
    }

    return (
        <div>
            <div
                ref={imageWrapper}
                style={{ 
                    width: heightDummyImage+'px', 
                    height: heightDummyImage+'px', 
                    position: 'relative',
                    style: 'none'
                }}
            >
                <Image
                    className={styles.img} 
                    src={url} 
                    // width={heightDummyImage}
                    // height={heightDummyImage}
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