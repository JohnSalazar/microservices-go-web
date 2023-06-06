import { AuthResponseType } from '@/types/auth-response-type'
import { CreateUserType } from '@/types/create-user-type'
import { SigninType } from '@/types/signin-type'
import { SignupType } from '@/types/signup-type'
import { UpdateClaimsType } from '@/types/update-claims-type'
import { UpdatePasswordType } from '@/types/update-password-type'
import { UserType } from '@/types/user-type'

import { apiService } from './axios'

export interface IAuthenticationService {
  GetUsers(email: string, page: number, size: number): Promise<UserType[]>
  Signin(signin: SigninType): Promise<AuthResponseType>
  Signup(signup: SignupType): Promise<AuthResponseType>
  CreateUser(user: UserType): Promise<ResponseType>
  RequestUpdatePassword(email: string): Promise<ResponseType>
  UpdatePassword(updatePassword: UpdatePasswordType): Promise<AuthResponseType>
  UpdateClaims(updateClaims: UpdateClaimsType): Promise<AuthResponseType>
}

export default function AuthenticationService() {
  const api = apiService()

  async function GetUsers(email: string, page: number, size: number) {
    const result = await api.get<UserType[]>(
      `/authentications/api/v1/${email}/${page}/${size}`
    )
    const response = await result.data

    return { response, nextPage: page }
  }

  async function Signin(signin: SigninType) {
    const result = await api.post<AuthResponseType>(
      `/authentications/api/v1/signin`,
      signin
    )
    const response = await result.data
    return response
  }

  async function CreateUser(user: CreateUserType) {
    const result = await api.post<UserType>(
      `/authentications/api/v1/user`,
      user
    )
    const response = await result.data
    return response
  }

  async function Signup(signup: SignupType) {
    const result = await api.post<AuthResponseType>(
      `/authentications/api/v1/signup`,
      signup
    )
    const response = await result.data
    return response
  }

  async function RequestUpdatePassword(email: string) {
    const result = await api.post<ResponseType>(
      `/authentications/api/v1/request-update-password`,
      { email: email }
    )
    const response = await result.data
    return response
  }

  async function UpdatePassword(updatePassword: UpdatePasswordType) {
    const result = await api.put<AuthResponseType>(
      `/authentications/api/v1/password/${updatePassword.email}`,
      {
        email: updatePassword.email,
        password: updatePassword.password,
        passwordConfirm: updatePassword.passwordConfirm,
        requestUpdatePasswordCode: updatePassword.requestUpdatePasswordCode,
      }
    )
    const response = await result.data
    return response
  }

  async function UpdateClaims(updateClaims: UpdateClaimsType) {
    const result = await api.put<AuthResponseType>(
      `/authentications/api/v1/claims/${updateClaims.id}`,
      {
        id: updateClaims.id,
        claims: updateClaims.claims,
        version: updateClaims.version,
      }
    )
    const response = await result.data
    return response
  }

  return {
    GetUsers,
    Signin,
    CreateUser,
    Signup,
    RequestUpdatePassword,
    UpdatePassword,
    UpdateClaims,
  }
}
