import { ClaimsType } from './claims-type'

export type UserType = {
  id: string
  email: string
  claims: ClaimsType[]
  version?: number
}
