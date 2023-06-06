import { createContext, useContext } from 'react'

import CouponService, { ICouponService } from '@/services/coupon-service'
import CustomerService, { ICustomerService } from '@/services/customer-service'
import OrderService, { IOrderService } from '@/services/order-service'
import ProductService, { IProductService } from '@/services/product-service'

type ApiContextType = {
  couponService: ICouponService
  customerService: ICustomerService
  productService: IProductService
  orderService: IOrderService
}

type ApiProviderProps = { children: React.ReactNode }

export const ApiContext = createContext({} as ApiContextType)

export function ApiProvider({ children }: ApiProviderProps) {
  const couponService = CouponService()
  const customerService = CustomerService()
  const productService = ProductService()
  const orderService = OrderService()

  return (
    <ApiContext.Provider
      value={{
        couponService,
        customerService,
        productService,
        orderService,
      }}
    >
      {children}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const context = useContext(ApiContext)
  return context
}
