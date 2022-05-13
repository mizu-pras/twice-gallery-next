import { Fragment } from 'react'
import styles from '../styles/RenderImage.module.css'

const RenderImage = ({ data }) => {
    return (
        <Fragment>
            { data.map(h => <p>{ h }</p>) }
        </Fragment>
    )
}

export default RenderImage