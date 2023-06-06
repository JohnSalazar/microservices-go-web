import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Box, Grid } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useApi } from '@/contexts/ApiContext'
import { useSearch } from '@/contexts/SearchContext'

import Product from './Product'

export default function Showcase() {
  const { ref, inView } = useInView()
  const { productService } = useApi()

  const { GetProducts } = productService

  const { word, setLoading } = useSearch()

  const fetchProducts = async (pageParam: number) => {
    const response = await GetProducts(word, pageParam, 10)

    return response?.response
  }

  const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery(
    ['products'],
    ({ pageParam = 1 }) => fetchProducts(pageParam),
    {
      // retry: 3,
      staleTime: 1000 * 60,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1
        return lastPage ? nextPage : undefined
      },
    }
  )

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    refetch().then(() => setLoading(false))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word])

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      marginTop={10}
      marginBottom={6}
    >
      {!isLoading && (
        <>
          {data?.pages.map((products) =>
            products?.map((product) => (
              <Grid item key={product.id}>
                <Product {...product} />
              </Grid>
            ))
          )}
          <Box ref={ref} />
        </>
      )}
    </Grid>
  )
}
