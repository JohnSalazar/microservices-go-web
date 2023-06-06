import { NextApiRequest } from 'next'

import { ClaimsType } from '@/types/claims-type'

import { apiService } from './axios'
import ConfigService from './config-service'
import TokenService from './token-service'

export default function FileUploadService() {
  const api = apiService()
  api.defaults.baseURL = ''

  // api.defaults.baseURL =
  //   process.env.NODE_ENV !== 'production'
  //     ? 'https://localhost:3000'
  //     : 'https://localhost'

  async function Upload(
    file: File,
    onUploadProgress: any
    // folderName: string,
    // fileName: string
  ): Promise<any> {
    const formData = new FormData()

    formData.append('file', file)
    // formData.append('folderName', folderName)
    formData.append('fileName', file.name)

    return await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  }

  async function Load(): Promise<any> {
    return await api.post('/api/load', {})
  }

  function VerifyNextApiRequest(
    request: NextApiRequest,
    claims: ClaimsType[]
  ): boolean {
    const { GetConfig } = ConfigService()
    const configFile = GetConfig()
    const { ReadToken, ValidateClaims } = TokenService()

    const cookies = request.cookies
    const accessToken = cookies[configFile.accessTokenName]
    if (!accessToken) return false

    const token = ReadToken(accessToken)
    // console.log('token: ', token)
    if (!token) return false

    if (claims.length > 0) {
      const userClaims = token.claims
      if (!userClaims || userClaims.length == 0) return false

      const sortedUserClaims = userClaims.sort((a, b) =>
        a.value > b.value ? 1 : -1
      )

      const claimsFound: boolean[] = []
      claims.forEach((claim) => {
        const typeUserFound = ValidateClaims(
          sortedUserClaims,
          claim.type,
          claim.value
        )
        if (typeUserFound) claimsFound.push(true)
      })

      return claimsFound.length == claims.length
    }

    return true
  }

  async function GetFileNameImageByInitials(initials: string) {
    const response = await api.get(`/api/getFileName?initials=${initials}`)
    const { fileName } = response.data

    return fileName
  }

  return { Upload, Load, VerifyNextApiRequest, GetFileNameImageByInitials }
}
