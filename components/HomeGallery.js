import Image from 'next/image'

import styles from '../styles/HomeGallery.module.css'

const HomeGallery = ({ data, width, column, row }) => {
    const name = data.slug.replace(/(-)/g, ' ')

    return (
        <div className={styles.wrapper} style={{ width, height: width, transform: `translate(${column*width}px, ${row*width}px)` }}>
            <div className={styles.thumbnail} >
                <Image 
                    src={data.thumbnail}
                    objectFit="cover"
                    alt="thumbnail" 
                    layout="fill"
                />
            </div>

            <div className={styles.overlay}></div>

            <div className={styles.desc}>
                <span>{ name }</span>
            </div>
        </div>
    )
}

export default HomeGallery