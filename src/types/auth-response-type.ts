import { UserType } from './user-type'

export type AuthResponseType = {
  accessToken: string
  refreshToken: string
  user: UserType
}
