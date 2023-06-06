import { ProductType } from './product-type'

export type CartType = {
  id?: string
  couponId?: string
  products: ProductType[]
  discount: number
  shipping: number
  cardNumber?: string
  version?: number
}
