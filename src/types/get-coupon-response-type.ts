import { CouponType } from './coupon-type'

export type GetCouponResponseType = {
  response: CouponType[]
  nextPage: number
}
