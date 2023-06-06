import fs from 'fs'
import https from 'https'

import { apiService } from './axios'

export default function FreeImageHostService() {
  const api = apiService()
  api.defaults.baseURL = 'https://freeimage.host'
  api.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })

  const api_key = '6d207e02198a847aa98d0a2a901485a5'

  async function Upload(pathToFile: string, filename: string) {
    const extension = filename.split('.').pop()
    const formData = new FormData()
    formData.append('key', api_key)
    formData.append('action', 'upload')
    formData.append(
      `source`,
      new Blob([fs.readFileSync(pathToFile)], { type: `image/${extension}` }),
      filename
    )

    const result = await api.post('/api/1/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    const response = await result.data
    return response
  }

  async function Exclude() {
    const deletionCode = 'HOze6OX.png'
    const formData = new FormData()
    formData.append('key', api_key)
    formData.append('action', 'delete')
    formData.append('codes', deletionCode)

    const result = await api.post('/api/1/delete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const response = await result.data
    return response
  }

  return { Upload, Exclude }
}
