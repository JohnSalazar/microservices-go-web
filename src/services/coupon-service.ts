import { CouponType } from '@/types/coupon-type'
import { GetCouponResponseType } from '@/types/get-coupon-response-type'

import { apiService } from './axios'

export interface ICouponService {
  GetCoupons(
    couponName: string,
    page: number,
    size: number
  ): Promise<GetCouponResponseType>
  GetCouponById(couponId: string): Promise<CouponType>
  GetCouponByName(couponName: string): Promise<CouponType>
  AddCoupon(coupon: CouponType): Promise<CouponType>
  UpdateCoupon(coupon: CouponType): Promise<CouponType>
}

export default function CouponService() {
  const api = apiService()

  async function GetCoupons(couponName: string, page: number, size: number) {
    const result = await api.get<CouponType[]>(
      `carts/api/v1/coupons/${couponName}/${page}/${size}`
    )
    const response = await result.data

    return { response, nextPage: page }
  }

  async function GetCouponById(couponId: string) {
    const result = await api.get<CouponType>(`carts/api/v1/coupon/${couponId}`)
    const response = await result.data

    return response
  }

  async function GetCouponByName(couponName: string) {
    const result = await api.get<CouponType>(
      `carts/api/v1/coupon/name/${couponName}`
    )
    const response = await result.data

    return response
  }

  async function AddCoupon(coupon: CouponType) {
    const result = await api.post<CouponType>(`carts/api/v1/coupon`, coupon)
    const response = await result.data

    return response
  }

  async function UpdateCoupon(coupon: CouponType) {
    const result = await api.put<CouponType>(
      `carts/api/v1/coupon/${coupon.id}`,
      coupon
    )
    const response = await result.data

    return response
  }

  return { GetCoupons, GetCouponById, GetCouponByName, AddCoupon, UpdateCoupon }
}
