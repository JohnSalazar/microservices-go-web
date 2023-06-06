import { useState } from 'react'
import { Anchor, ShoppingBagOutlined, ShoppingCart } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Icon,
  IconButton,
  Typography,
} from '@mui/material'
import Link from 'next/link'

import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { CartType } from '@/types/cart-type'
import { ProductType } from '@/types/product-type'

import '@/utils/number.extensions'

import ProductImage from './product/ProductImage'

export const initialCartType: CartType = {
  id: undefined,
  couponId: undefined,
  products: [],
  discount: 0,
  shipping: 0,
  cardNumber: '',
  version: undefined,
}

type Anchor = 'right'

export default function Cart() {
  const { isAuthenticated } = useAuth()
  const [imageLoaded, setImageLoaded] = useState<string[]>([])

  const { cart, updateProduct, removeProduct } = useCart()

  const [state, setState] = useState({
    right: false,
  })

  const maxquantity = 10

  const anchor = 'right'

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (!cart.products || cart.products?.length == 0) return
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
    }

  const handleSum = (index: number, product: ProductType) => {
    if (product.quantity == maxquantity) return
    product.quantity++
    updateProduct(index, product)
  }

  const handleDeduct = (index: number, product: ProductType) => {
    if (product.quantity == 1) return
    product.quantity--
    updateProduct(index, product)
  }

  const handleRemove = (index: number) => {
    removeProduct(index)
    if (cart.products.length == 0) {
      setState({ ...state, [anchor]: false })
    }
  }

  return (
    <>
      {!isAuthenticated ? (
        <IconButton>
          <Badge color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      ) : (
        <>
          <IconButton onClick={toggleDrawer(anchor, true)}>
            <Badge badgeContent={cart.products?.length} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <Box
              color="primary"
              sx={{
                width: '380px',
              }}
            >
              <Box
                sx={{
                  overflow: 'auto',
                  height: 'calc((100vh - 80px) - 3.25rem)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '0px 20px',
                    height: '74px',
                  }}
                >
                  <Icon>
                    <ShoppingBagOutlined />
                  </Icon>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '16px',
                      marginLeft: '8px',
                    }}
                  >
                    {cart.products?.length}
                    {cart.products?.length == 1 ? ' item' : ' itens'}
                  </Typography>
                </Box>
                <Divider />
                {cart.products?.map((product, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        padding: '16px 20px',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{
                            height: '32px',
                            width: '32px',
                            minWidth: '32px',
                            borderRadius: '300px',
                          }}
                          onClick={() => handleSum(index, product)}
                        >
                          <AddIcon />
                        </Button>
                        <Box
                          sx={{
                            fontWeight: '600',
                            fontSize: '15px',
                            marginTop: '3px',
                            marginBottom: '3px',
                          }}
                        >
                          {product.quantity}
                        </Box>
                        <Button
                          variant="outlined"
                          color="secondary"
                          sx={{
                            height: '32px',
                            width: '32px',
                            minWidth: '32px',
                            borderRadius: '300px',
                          }}
                          onClick={() => handleDeduct(index, product)}
                        >
                          <RemoveIcon />
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginLeft: '16px',
                          marginRight: '16px',
                          width: '76px',
                          height: '76px',
                        }}
                      >
                        <ProductImage
                          product={product}
                          imageLoaded={imageLoaded}
                          setImageLoaded={setImageLoaded}
                          model={3}
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: '1 1 0',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {product.name}
                        </Typography>
                      </Box>
                      <IconButton
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          margin: '0px 0px 0px 20px',
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          flex: '0 0 auto',
                          fill: 'currentcolor',
                        }}
                        onClick={() => handleRemove(index)}
                      >
                        <CloseIcon sx={{ width: '20px' }} />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '12px',
                          paddingRight: '20px',
                        }}
                      >
                        {product?.price.toCurrency()} x {product.quantity}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: '600',
                          fontSize: '16px',
                          color: 'red',
                        }}
                      >
                        {sumProduct(product).toCurrency()}
                      </Typography>
                    </Box>
                    <Divider flexItem />
                  </Box>
                ))}
                <Box
                  sx={{
                    padding: '20px',
                  }}
                >
                  <Link href={'/checkout'}>
                    <Button
                      variant="contained"
                      color="error"
                      disableElevation
                      fullWidth
                      sx={{
                        margin: '0px 0px 0.75rem',
                      }}
                    >
                      Pay({sumPay(cart).toCurrency()})
                    </Button>
                  </Link>
                  <Button
                    variant="outlined"
                    onClick={toggleDrawer(anchor, false)}
                    color="error"
                    fullWidth
                  >
                    Back
                  </Button>
                </Box>
              </Box>
            </Box>
          </Drawer>
        </>
      )}
    </>
  )
}

export const sumProduct = (product: ProductType): number => {
  const price: number = product?.price
  const total: number = price * product.quantity

  return total
}

export const sumPay = (cart: CartType): number => {
  let total = 0
  cart.products?.map((product) => {
    const sum = sumProduct(product)
    total = total + sum
  })

  return total
}

export const subTotal = (cart: CartType): number => {
  return sumPay(cart) - cart.discount
}

export const total = (cart: CartType): number => {
  return subTotal(cart) + cart.shipping
}
