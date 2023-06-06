import { useEffect, useState } from 'react'
import { Box, Container, Grid, Stack } from '@mui/material'
import { useRouter } from 'next/router'

import Address from '@/components/address/Address'
import Card from '@/components/Card'
import Layout from '@/components/Layout'
import Order from '@/components/Order'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

export default function Checkout() {
  const { isAuthenticated } = useAuth()
  const { cart } = useCart()
  const router = useRouter()

  const [addressId, setAddressId] = useState<string | null>(null)
  const [finalized, setFinalized] = useState(false)

  useEffect(() => {
    if (finalized) return
    if (!isAuthenticated || cart.products?.length == 0) router.push('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.products, isAuthenticated])

  return (
    <>
      <Box sx={{ background: 'background.default', height: '100vh' }}>
        <Layout>
          <Container>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginTop={10}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Grid item>
                  <Address addressId={addressId} setAddressId={setAddressId} />
                  <Card addressId={addressId} setFinalized={setFinalized} />
                </Grid>
                <Grid item>
                  <Order />
                </Grid>
              </Stack>
            </Grid>
          </Container>
        </Layout>
      </Box>
    </>
  )
}
