import { OrderType } from '@/types/order-type'

import { apiService } from './axios'

export interface IOrderService {
  GetAll(): Promise<OrderType[]>
}

export default function OrderService() {
  const api = apiService()

  async function GetAll() {
    const result = await api.get<OrderType[]>(`orders/api/v1/`)
    const response = await result.data

    return response
  }

  return { GetAll }
}
