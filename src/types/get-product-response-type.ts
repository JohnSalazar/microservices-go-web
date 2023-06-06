import { ProductType } from './product-type'

export type GetProductResponseType = {
  response: ProductType[]
  nextPage: number
}
