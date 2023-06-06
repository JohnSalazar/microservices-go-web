import { ClaimsType } from './claims-type'

export type TokenType = {
  sub: string
  email: string
  jti: string
  nbf: number
  iat: number
  exp: number
  iss: string
  claims: ClaimsType[]
}
