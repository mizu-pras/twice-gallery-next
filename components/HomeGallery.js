import Image from 'next/image'

import styles from '../styles/HomeGallery.module.css'

const HomeGallery = ({ data }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.thumbnail}>
                <Image 
                    src={data.thumbnail}
                    objectFit="cover"
                    alt="thumbnail" 
                    layout="fill"
                />
            </div>
        </div>
    )
}

export default HomeGallery