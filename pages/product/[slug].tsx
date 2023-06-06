import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Layout from '@/components/Layout'
import Details from '@/components/product/Details'
import { useApi } from '@/contexts/ApiContext'
import ErrorService from '@/services/error-service'
import { ProductType } from '@/types/product-type'

//export default function Product(data) {
export default function Product() {
  const router = useRouter()
  const { productService } = useApi()
  const { GetProductBySlug } = productService
  const { ErrorHandler } = ErrorService()

  const [product, setProduct] = useState<ProductType>()
  const slug = router.query.slug as string

  useEffect(() => {
    GetProductBySlug(slug)
      .then((res) => setProduct(res))
      .catch((err) => ErrorHandler(err))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // const { product } = data

  return (
    <>
      {product && (
        <>
          <Head>
            <title>MyShop - Product: {product.slug}</title>
            <meta
              name="description"
              content={`MyShop - Product: ${product.slug}`}
            />
            <meta property="og:title" content={`Product: ${product.slug}`} />
            <meta
              property="og:description"
              content={`Product: ${product.slug}`}
            />
            <meta
              property="og:url"
              content={`https://www.myshop.com/product/${product.slug}`}
            />
            <meta property="og:type" content="website" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Grid>
            <Layout>
              <Details {...product} />
            </Layout>
          </Grid>
        </>
      )}
    </>
  )
}

// export const getStaticProps = async ({ params: { slug } }: any) => {
//   const { GetProductBySlug } = ProductService()

//   const product = await GetProductBySlug(slug)

//   return {
//     props: { product },
//     revalidate: 30,
//   }
// }

// export const getStaticPaths = async () => {
//   const { GetProducts } = ProductService()

//   const products = await GetProducts(' ', 1, 10)

//   const paths = products?.response?.map((product) => ({
//     params: {
//       slug: product.slug,
//     },
//   }))

//   return { paths, fallback: true }
// }
