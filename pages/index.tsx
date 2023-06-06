import { Box } from '@mui/material'
import Head from 'next/head'

import Layout from '@/components/Layout'
import Showcase from '@/components/product/Showcase'

export default function Home() {
  return (
    <>
      <Head>
        <title>MyShop</title>
        <meta name="description" content="Welcome to MyShop eCommerce" />
        <meta property="og:title" content="MyShop" />
        <meta property="og:description" content="Welcome to MyShop eCommerce" />
        <meta property="og:url" content="https://www.myshop.com" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Layout>
          <Showcase />
        </Layout>
      </Box>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   console.log('ctx.resolvedUrl: ', ctx.resolvedUrl)

//   return { props: {} }
// }

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const {
//     ['myshop.accessToken']: accessToken,
//     // 'myshop.refreshToken': refreshToken,
//   } = parseCookies(ctx)

//   if (!accessToken) {
//     console.log('está redirecionando para login')
//     return {
//       redirect: {
//         destination: '/signin',
//         permanent: false,
//       },
//     }
//   }

//   return { props: {} }
// }
