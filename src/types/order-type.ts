import { ProductType } from './product-type'

type OrderStatusType = {
  status: number
  description: string
}

export const OrderStatus: OrderStatusType[] = [
  {
    status: 0,
    description: 'Awaiting payment confirmation',
  },
  {
    status: 1,
    description: 'Order canceled',
  },
  { status: 2, description: 'Order created' },
  { status: 3, description: 'Payment canceled' },
  { status: 4, description: 'Payment confirmed' },
  { status: 5, description: 'Payment rejected' },
  { status: 6, description: 'Sent for payment confirmation' },
]

export type OrderType = {
  id: string
  products: ProductType[]
  sum: number
  discount: number
  status: number
  status_at: string
  created_at: string
  version: number
}
