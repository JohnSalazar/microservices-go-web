import { TypeAddress } from '@/enums/type-address-enum'

export type AddressType = {
  id: string
  customerId: string
  street: string
  province: string
  city: string
  code: string
  type: TypeAddress
  version: number
}
