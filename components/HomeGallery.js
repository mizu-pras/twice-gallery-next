import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/HomeGallery.module.css'

const HomeGallery = ({ data, menu, width, column, row }) => {
    const name = data.slug.replace(/(-)/g, ' ')

    return (
        <Link href={`/${menu}/${data.slug}`} passHref={false}>
            <div className={styles.wrapper} style={{ width, height: width, transform: `translate(${column*width}px, ${row*width}px)` }}>
                <div className={styles.thumbnail} >
                    {
                        data.thumbnail && <Image 
                            src={data.thumbnail}
                            objectFit="cover"
                            alt="thumbnail" 
                            layout="fill"
                        />
                    }
                </div>

                <div className={styles.overlay}></div>

                <div 
                    className={styles.desc}
                    style={{ 
                        lineHeight: '1.4em',
                        height: '2.8em'
                    }}
                >
                    <span>{ name }</span>
                </div>    
            </div>
        </Link>
    )
}

export default HomeGallery