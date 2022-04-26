import { useState, useEffect } from 'react';

// const getWindowDimensions = () => {
//     const { innerWidth: width, innerHeight: height } = window;
//     return {
//         width,
//         height
//     };
// }

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            function handleResize() {
                setWindowDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
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