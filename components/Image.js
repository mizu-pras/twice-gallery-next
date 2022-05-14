import { useState } from 'react'
import styles from '../styles/Image.module.css'

const Image = ({ url, heightDummyImage }) => {
    const [loaded, setLoaded] = useState(false)

    return (
        <div>
            { !loaded && <div className={styles.loadingImage} style={{ height: `${heightDummyImage}px` }}></div> }
            <img
                className={styles.img} 
                style={!loaded ? { display: 'none' } : {}}
                src={url} 
                alt='' 
                onLoad={() => setLoaded(true)}
            />
        </div>
    )
}

export default Image