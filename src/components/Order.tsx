import {
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'

import { useCart } from '@/contexts/CartContext'

import { sumPay, sumProduct, total } from './Cart'

export default function Order() {
  const { cart } = useCart()

  return (
    <Grid container>
      <Grid item>
        <Box>
          <Box
            component="p"
            sx={{
              marginBottom: '16px',
              marginTop: '0px',
              fontSize: '14px',
              fontWeight: '700',
            }}
          >
            Your Order
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 50 }} size="small">
                <TableBody>
                  {cart?.products?.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ borderBottom: 'none' }}
                      >
                        <Box
                          component="p"
                          sx={{
                            marginBottom: '0px',
                            marginTop: '0px',
                            fontSize: '14px',
                            textTransform: 'none',
                            whiteSpace: 'normal',
                          }}
                        >
                          <Box
                            component="span"
                            sx={{ fontWeight: '700', fontSize: '14px' }}
                          >
                            {product.quantity}
                          </Box>{' '}
                          x {product.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 'none' }}>
                        <Box
                          component="p"
                          sx={{
                            marginBottom: '0px',
                            marginTop: '0px',
                            fontSize: '14px',
                            textTransform: 'none',
                            whiteSpace: 'normal',
                          }}
                        >
                          {sumProduct(product).toCurrency()}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Divider
            sx={{
              marginTop: '24px',
              marginBottom: '24px',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <Box
              component="p"
              sx={{
                marginBottom: '0px',
                marginTop: '0px',
                fontSize: '14px',
                textTransform: 'none',
                whiteSpace: 'normal',
              }}
            >
              Subtotal:
            </Box>
            <Box
              sx={{
                marginBottom: '0px',
                marginTop: '0px',
                fontSize: '14px',
                textTransform: 'none',
                whiteSpace: 'normal',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '700',
                  fontSize: '14px',
                }}
              >
                {sumPay(cart).toCurrency()}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <Box
              sx={{
                marginBottom: '0px',
                marginTop: '0px',
                fontSize: '14px',
                textTransform: 'none',
                whiteSpace: 'normal',
              }}
            >
              Shipping:
            </Box>
            <Box
              sx={{
                marginBottom: '0px',
                marginTop: '0px',
                fontSize: '14px',
                textTransform: 'none',
                whiteSpace: 'normal',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '700',
                  fontSize: '14px',
                }}
              >
                {cart.shipping.toCurrency()}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <Box
              sx={{
                marginBottom: '0px',
                marginTop: '0px',
                fontSize: '14px',
                textTransform: 'none',
                whiteSpace: 'normal',
              }}
            >
              Discount:
            </Box>
            <Box
              sx={{
                marginBottom: '0px',
                marginTop: '0px',
                fontSize: '14px',
                textTransform: 'none',
                whiteSpace: 'normal',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '700',
                  fontSize: '14px',
                }}
              >
                {cart.discount.toCurrency()}
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              marginTop: '24px',
              marginBottom: '24px',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <Box
              sx={{
                marginBottom: '0px',
                marginTop: '0px',
                fontSize: '14px',
                textTransform: 'none',
                whiteSpace: 'normal',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '700',
                  fontSize: '14px',
                }}
              >
                Total:
              </Typography>
            </Box>
            <Box
              sx={{
                marginBottom: '0px',
                marginTop: '0px',
                fontSize: '14px',
                textTransform: 'none',
                whiteSpace: 'normal',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '700',
                  fontSize: '14px',
                }}
              >
                {total(cart).toCurrency()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
