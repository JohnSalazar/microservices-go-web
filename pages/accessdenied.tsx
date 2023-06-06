import Head from 'next/head'

export default function AccessDenied() {
  return (
    <>
      <Head>
        <title>MyShop</title>
        <meta name="description" content="Access Denied" />
        <meta property="og:title" content="MyShop" />
        <meta property="og:description" content="Access Denied" />
        <meta property="og:url" content="https://myshop.com/accessdenied" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>ACCESS DENIED</h1>
    </>
  )
}
