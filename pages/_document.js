import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang='en'>
                <Head>
                    <meta name="robots" content="all" />
                    <link rel="icon" href="/logo.png" />

                    {/*<link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />*/}
                    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main/>
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument