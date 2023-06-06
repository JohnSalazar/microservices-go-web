import { ClaimsType } from './claims-type'

export type ProtectedURLType = {
  pathName: string
  claims: ClaimsType[]
}
