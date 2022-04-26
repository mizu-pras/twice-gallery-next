import { useState, useEffect } from 'react';

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            function handleResize() {
                setWindowDimensions({
                    width: document.body.clientWidth,
                    height: document.body.clientHeight,
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