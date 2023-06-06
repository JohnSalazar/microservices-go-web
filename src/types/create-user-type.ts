import { ClaimsType } from './claims-type'

export type CreateUserType = {
  email: string
  claims: ClaimsType[]
  password: string
  passwordConfirm: string
}
