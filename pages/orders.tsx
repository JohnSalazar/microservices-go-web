import { useEffect, useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Layout from '@/components/Layout'
import ProductImage from '@/components/product/ProductImage'
import { useApi } from '@/contexts/ApiContext'
import { useAuth } from '@/contexts/AuthContext'
import ErrorService from '@/services/error-service'
import { OrderStatus, OrderType } from '@/types/order-type'

import '@/utils/string.extensions'

export default function Orders() {
  const [imageLoaded, setImageLoaded] = useState<string[]>([])
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<OrderType[]>()
  const { orderService } = useApi()
  const { GetAll } = orderService
  const { ErrorHandler } = ErrorService()

  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  useEffect(() => {
    getAll()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAll = async () => {
    setLoading(true)
    setDisabled(true)
    GetAll()
      .then((res) => {
        setOrders(res)
        setLoading(false)
      })
      .catch((err) => {
        ErrorHandler(err)
        setLoading(false)
      })

    setTimeout(() => {
      setDisabled(false)
    }, 1000 * 10)
  }

  return (
    <>
      <Head>
        <title>MyShop - Orders</title>
        <meta name="description" content="My orders" />
        <meta property="og:title" content="MyShop - Orders" />
        <meta property="og:description" content="My Orders" />
        <meta property="og:url" content="https://www.myshop.com/orders" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Layout>
          <Container>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginTop={10}
            >
              <Stack
                spacing={2}
                sx={{ width: { xs: '100%', sm: '100%', md: '70%' } }}
              >
                <Grid item>
                  <Box sx={{ margin: '30px 30px' }}>
                    <Stack direction={'row'}>
                      <Grid item xs={11}>
                        <Typography variant="h5">My Orders</Typography>
                      </Grid>
                      {orders && orders?.length > 0 && (
                        <Grid item xs={1}>
                          {loading ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: '#D32F2F' }}
                            />
                          ) : (
                            <Button
                              variant="text"
                              color="inherit"
                              sx={{
                                textTransform: 'capitalize',
                                color: '#D32F2F',
                                fontWeight: '600',
                                lineHeight: '1',
                              }}
                              endIcon={<RefreshIcon />}
                              onClick={getAll}
                              disabled={disabled}
                            >
                              Refresh
                            </Button>
                          )}
                        </Grid>
                      )}
                    </Stack>
                  </Box>
                  {orders?.map((order) => (
                    <Paper
                      key={order.id}
                      variant="outlined"
                      square
                      sx={{
                        borderRadius: '8px',
                        fontSize: '14px',
                        lineHeight: '20px',
                        marginBottom: '12px',
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: '8px 8px 0 0',
                          backgroundColor: '#F0F2F2!important',
                        }}
                      >
                        <Stack direction={'row'} padding={'14px 18px'}>
                          <Grid item xs={3}>
                            <Typography fontSize={'12px'}>
                              {OrderStatus.find(
                                (status) => status.status == order.status
                              )?.description.toUpperCase()}
                            </Typography>
                            <Typography fontSize={'14px'}>
                              {order.created_at.toDateWithLocale()}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography fontSize={'12px'}>TOTAL</Typography>
                            <Typography fontSize={'14px'}>
                              {order.sum.toCurrency()}
                            </Typography>
                          </Grid>
                          <Grid item xs={3} />
                          <Grid item xs={3}>
                            <Typography fontSize={'12px'}>ORDER Nº</Typography>
                            <Typography fontSize={'11px'}>
                              {order.id}
                            </Typography>
                          </Grid>
                        </Stack>
                      </Box>
                      {order.products.map((product) => (
                        <Stack
                          key={product.id}
                          direction={'row'}
                          padding={'14px 18px'}
                        >
                          <Grid item xs={3}>
                            <Box
                              sx={(theme) => ({
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                [theme.breakpoints.up('sm')]: {
                                  marginLeft: '16px',
                                  marginRight: '16px',
                                },
                              })}
                            >
                              <ProductImage
                                product={product}
                                imageLoaded={imageLoaded}
                                setImageLoaded={setImageLoaded}
                                model={2}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.primary!important"
                              overflow="clip"
                              maxHeight={90}
                              lineHeight={1.1}
                              textAlign="justify"
                            >
                              {product.description}
                            </Typography>
                          </Grid>
                        </Stack>
                      ))}
                      <Divider />
                      <Box
                        sx={{
                          borderRadius: '8px 8px 0 0',
                          height: '50px',
                        }}
                      >
                        <Stack direction={'row'} padding={'14px 18px'}>
                          <Grid item>
                            <Typography fontSize={'14px'}>
                              Order date: {order.created_at.toDateWithLocale()}
                            </Typography>
                          </Grid>
                        </Stack>
                      </Box>
                    </Paper>
                  ))}
                </Grid>
              </Stack>
            </Grid>
          </Container>
        </Layout>
      </Box>
    </>
  )
}
