import { ClaimsType } from './claims-type'

export type UpdateClaimsType = {
  id: string
  claims: ClaimsType[]
  version?: number
}
