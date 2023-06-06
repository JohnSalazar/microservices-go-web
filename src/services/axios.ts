import axios from 'axios'
import https from 'https'
import { parseCookies } from 'nookies'

import CircuitBreaker from './circuit-breaker'
import ConfigService from './config-service'
import PromiseService from './promises'

export function apiService(accessToken?: string) {
  const { GetConfig } = ConfigService()
  const config = GetConfig()
  const { requestRefreshToken } = PromiseService()

  if (!accessToken) {
    const { [config.accessTokenName]: _accessToken } = parseCookies()
    accessToken = _accessToken
  }
  const { [config.refreshTokenName]: refreshToken } = parseCookies()

  // const retry = 3
  // const retryDelay = 1000

  const httpsAgent = new https.Agent({
    key: process.env.TLS_KEY,
    cert: process.env.TLS_CERT,
    ca: [process.env.TLS_CA],
  })

  const axiosInstance = axios.create({
    baseURL: config?.endPoint,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    httpsAgent,
    // httpsAgent: new https.Agent({
    //   rejectUnauthorized: false,
    // }),
    withCredentials: !!accessToken,
  })

  const { fire, success, failure } = CircuitBreaker({
    failureThreshold: 5,
    timeout: 5000,
  })

  axiosInstance.interceptors.request.use(
    (config) => {
      fire(config)
      return config
    },
    (error) => {
      throw error
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      success()
      return response
    },
    (error) => {
      const { config: axiosConfig } = error
      if (!axiosConfig) {
        failure()
        return Promise.reject(error)
      }

      const status = error.response?.status
      if (status === 401 && refreshToken) {
        return requestRefreshToken(axiosInstance, axiosConfig, refreshToken)
      }

      failure()
      return Promise.reject(error)
    }
  )

  return axiosInstance

  //     return Promise.reject(axiosConfig)
  //   },
  //   (error) => error
  // )

  // axiosInstance.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     const { config: axiosConfig } = error

  //     if (!axiosConfig) return Promise.reject(error)

  //     const status = error.response?.status
  //     if (status === 401 && refreshToken) {
  //       const retryRequest = new Promise((resolve) => {
  //         axiosInstance
  //           .post<AuthResponseType>('/authentications/api/v1/refresh-token', {
  //             refreshToken: refreshToken,
  //           })
  //           .then((resp) => {
  //             const { accessToken, refreshToken } = resp.data

  //             SetCookieFromToken(config.accessTokenName, accessToken)
  //             SetCookieFromToken(config.refreshTokenName, refreshToken)

  //             axiosConfig.headers.Authorization = `Bearer ${accessToken}`

  //             resolve(axiosInstance(axiosConfig))
  //           })
  //       }).catch((err) => Promise.reject(err))

  //       return retryRequest
  //     }

  //     if (retry > 0) {
  //       const delayRetryRequest = new Promise((resolve) => {
  //         setTimeout(() => {
  //           console.log('retry the request', axiosConfig.url)
  //           resolve(axiosInstance(axiosConfig))
  //         }, retryDelay)
  //       })

  //       retry -= 1
  //       retryDelay *= retryDelay < 4000 ? 2 : 1
  //       return delayRetryRequest
  //     }

  //     return Promise.reject(error)
  //   }
  // )

  // axiosInstance.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     const { config: axiosConfig } = error

  //     if (!axiosConfig) return Promise.reject(error)

  //     circuitBreaker
  //       .fire(axiosConfig)
  //       .then(() => Promise.resolve())
  //       .catch((error) => Promise.reject(error))
  //   }
  // )
}
