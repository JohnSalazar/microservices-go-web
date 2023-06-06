import { AxiosInstance } from 'axios'

import { AuthResponseType } from '@/types/auth-response-type'

import ConfigService from './config-service'
import TokenService from './token-service'

export default function PromiseService() {
  const { GetConfig } = ConfigService()
  const config = GetConfig()
  const { SetCookieFromToken } = TokenService()

  function requestRefreshToken(
    axiosInstance: AxiosInstance,
    axiosConfig: any,
    refreshToken: string
  ) {
    const retryRequest = new Promise((resolve) => {
      axiosInstance
        .post<AuthResponseType>('/authentications/api/v1/refresh-token', {
          refreshToken: refreshToken,
        })
        .then((response) => {
          const { accessToken, refreshToken } = response.data

          SetCookieFromToken(config.accessTokenName, accessToken)
          SetCookieFromToken(config.refreshTokenName, refreshToken)

          axiosConfig.headers.Authorization = `Bearer ${accessToken}`

          resolve(axiosInstance(axiosConfig))
        })
    }).catch((error) => Promise.reject(error))

    return retryRequest
  }

  function requestOthers(axiosInstance: AxiosInstance, error: any) {
    const { config: axiosConfig } = error
    const retryRequest = new Promise((resolve) => {
      resolve(axiosInstance(axiosConfig))
    }).catch((error) => Promise.reject(error))

    return retryRequest
  }

  return { requestRefreshToken, requestOthers }
}
