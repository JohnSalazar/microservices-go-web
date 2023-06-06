import { useState } from 'react'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import Link from 'next/link'

import { useCart } from '@/contexts/CartContext'
import { ProductType } from '@/types/product-type'

import ProductImage from './ProductImage'

export const initialProductType: ProductType = {
  id: '',
  name: '',
  slug: '',
  price: 0,
  quantity: 0,
  image: '',
  version: 0,
}

export default function Product(product: ProductType) {
  const cart = useCart()
  const [imageLoaded, setImageLoaded] = useState<string[]>([])

  const addToCart = ({ ...product }: ProductType) => {
    product.quantity = 1
    cart.addProduct(product)
  }

  return (
    <Card
      variant="outlined"
      sx={{
        width: '306px',
        height: '586px',
        borderRadius: '4px',
      }}
    >
      <Link href={`/product/${product.slug}`} color="inherit">
        <a {...product}>
          <Box
            sx={{
              height: '290px',
              minHeight: '10em',
              display: 'flex',
              verticalAlign: 'middle',
            }}
          >
            <ProductImage
              product={product}
              imageLoaded={imageLoaded}
              setImageLoaded={setImageLoaded}
              model={1}
            />
          </Box>
        </a>
      </Link>
      <CardContent>
        <Link href={`/product/${product.slug}`} color="inherit">
          <Typography
            variant="body1"
            color="text.primary!important"
            overflow="clip"
            maxHeight={60}
            paddingBottom={12}
          >
            {product.name}
          </Typography>
        </Link>
        <Box
          sx={{
            display: 'flex',
            marginBottom: '10px',
          }}
        >
          <Typography component="span" color="text.primary" fontSize="13px">
            {product.price?.getCurrencySymbol()}
          </Typography>
          <Typography
            component="span"
            color="text.primary"
            sx={{
              font: 'caption',
              fontSize: '28px',
            }}
          >
            {product.price?.getDigits()}
          </Typography>
          <Typography component="span" color="text.primary" fontSize="13px">
            {product.price?.getCents()}
          </Typography>
          <Button
            variant="contained"
            sx={{ margin: 'auto' }}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </Button>
        </Box>
        <Link href={`/product/${product.slug}`} color="inherit">
          <Typography
            variant="body2"
            color="text.primary!important"
            overflow="clip"
            maxHeight={220}
            lineHeight={1.6}
            textAlign="justify"
          >
            {product.description}
          </Typography>
        </Link>
      </CardContent>
    </Card>
  )
}
