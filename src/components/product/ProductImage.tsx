import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CardMedia } from '@mui/material'
import Image from 'next/image'

import ConfigService from '@/services/config-service'
import { ProductType } from '@/types/product-type'

type ProductImageProps = {
  product: ProductType
  imageLoaded: string[]
  setImageLoaded: Dispatch<SetStateAction<string[]>>
  model: number
}

export default function ProductImage({
  product,
  imageLoaded,
  setImageLoaded,
  model,
}: ProductImageProps) {
  const { GetConfig } = ConfigService()
  const config = GetConfig()
  const [image, setImage] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (imageLoaded.find((productId) => productId == product.id)) return

    setImage(product.image ? product.image : config.defaultProductImage)
    setImageLoaded([product.id || product.slug])

    // LoadProductImage(product.image)
    //   .then((image) => {
    //     setImage(image ?? config.defaultProductImage)
    //     setImageLoaded([product.id || product.slug])
    //   })
    //   .catch(() => setImage(config.defaultProductImage))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  switch (model) {
    case 1:
      return (
        <CardMedia
          id={`product-image-${product.id}`}
          component="img"
          image={image ?? '/spinner.gif'}
          alt={product.name}
          sx={{
            maxWidth: 'max-content',
            maxHeight: '290px',
            margin: 'auto',
          }}
        />
      )
    case 2:
      return (
        <Image
          id={`product-image-${product.id}`}
          src={image ?? '/spinner.gif'}
          alt={product.name}
          width={'100%'}
          height={'100%'}
        />
      )
    case 3:
      return (
        <Image
          id={`product-image-${product.id}`}
          src={image ?? '/spinner.gif'}
          alt={product.name}
          width={76}
          height={76}
        />
      )
    default:
      return null
  }
}
