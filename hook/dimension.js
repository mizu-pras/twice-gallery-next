import { useState, useEffect } from 'react';

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: undefined,
        height: undefined,
        view: undefined
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            function handleResize() {
                const width = document.body.clientWidth
                const height = document.body.clientHeight

                let view
                if (width >= 1200) {
                    view = 'lg'
                }
                else if (width >= 992) {
                    view = 'md'
                }
                else {
                    view = 'sm'
                }

                setWindowDimensions({
                    width,
                    height,
                    view
                })
            }
    
            window.addEventListener('resize', handleResize)

            handleResize()

            return () => window.removeEventListener('resize', handleResize)
        }
    }, []);

    return windowDimensions;
}

export default useWindowDimensions