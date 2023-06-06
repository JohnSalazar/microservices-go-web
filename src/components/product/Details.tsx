import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'

import { useCart } from '@/contexts/CartContext'
import { ProductType } from '@/types/product-type'

import ProductImage from './ProductImage'

export default function Details(product: ProductType) {
  const cart = useCart()
  const [imageLoaded, setImageLoaded] = useState<string[]>([])

  const maxquantity = product.quantity
  const [quantity, setQuantity] = useState(1)

  const handleQuantity = (e: { target: { value: string } }) => {
    setQuantity(parseInt(e.target.value))
  }

  const addToCart = ({ ...product }: ProductType) => {
    product.quantity = quantity
    cart.addProduct(product)
  }

  const renderQuantity = (quantity: number) => {
    const quantityMap = [...Array(quantity)].slice(0, 10)
    return quantityMap.map((_, index) => {
      return (
        <MenuItem key={index} value={index + 1}>
          {index + 1}
        </MenuItem>
      )
    })
  }

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
      <Box
        sx={{
          height: '290px',
          minHeight: '10em',
          display: 'flex',
          verticalAlign: 'middle',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          padding: '10px',
        }}
      >
        <ProductImage
          product={product}
          imageLoaded={imageLoaded}
          setImageLoaded={setImageLoaded}
          model={1}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            marginTop: '20px',
            marginBottom: '40px',
          }}
        >
          <Box sx={{ width: 80 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="quantity-select-label">Qtd</InputLabel>
              <Select
                labelId="quantity"
                id="quantity"
                value={quantity.toString()}
                label="Quantity"
                onChange={handleQuantity}
              >
                {maxquantity > 0 ? renderQuantity(maxquantity) : undefined}
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" onClick={() => addToCart(product)}>
            Add to Cart
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          padding: '20px',
          height: '442px',
          width: '442px',
          maxWidth: '679px',
          maxHeight: '679px',
          marginRight: '15px',
        }}
      >
        <Typography color="text.primary" fontSize="24px" lineHeight="32px">
          {product.name}
        </Typography>
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
        </Box>
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
      </Box>
    </Grid>
  )
}
