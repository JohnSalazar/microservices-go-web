import axios from 'axios'
import { X509Certificate } from 'crypto'
import fs from 'fs'
import https from 'https'

import ConfigService from './config-service'

export default function CertificateService() {
  const { GetConfig } = ConfigService()
  const config = GetConfig()
  const hash = getHash()

  const api = axios.create({
    // baseURL: config?.endPoint,
    headers: {
      'Content-Type': 'application/json',
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })

  async function RequestCertificateCA() {
    const endPointConfig = GetConfig()
    const result = await api.get(
      `${endPointConfig.endPointGetCertificateCA}/${hash}`
    )
    const response = await result.data

    return response
  }

  async function RequestCertificateHost() {
    const endPointConfig = GetConfig()
    const result = await api.get(
      `${endPointConfig.endPointGetCertificateHost}/${hash}`
    )
    const response = await result.data

    return response
  }

  async function RequestCertificateHostKey() {
    const endPointConfig = GetConfig()
    const result = await api.get(
      `${endPointConfig.endPointGetCertificateHostKey}/${hash}`
    )
    const response = await result.data

    return response
  }

  function getHash() {
    const buff = Buffer.from(config.passwordPermissionEndPoint)
    return buff.toString('base64')
  }

  function GetPathCertificateCA() {
    const caCertPath = `${config.certificateFolderName}/ca_${config.certificateFileName}`

    return { caCertPath }
  }

  function GetPathsCertificateHostAndKey() {
    const certPath = `${config.certificateFolderName}/${config.certificateFileName}`
    const keyPath = `${config.certificateFolderName}/${config.certificateKeyFileName}`

    return { certPath, keyPath }
  }

  async function ReadCertificateCA() {
    const { caCertPath } = GetPathCertificateCA()
    try {
      const caCertBuffer = await fs.readFileSync(caCertPath)
      return new X509Certificate(caCertBuffer)
    } catch (err) {
      console.error('Read Certificate CA error: ', err)
      return
    }
  }

  async function ReadCertificate() {
    const { certPath } = GetPathsCertificateHostAndKey()
    try {
      const certBuffer = await fs.readFileSync(certPath)
      return new X509Certificate(certBuffer)
    } catch (err) {
      console.error('Read Certificate error: ', err)
      return
    }
  }

  function GetTLSCredentials() {
    const { caCertPath } = GetPathCertificateCA()
    const { certPath, keyPath } = GetPathsCertificateHostAndKey()

    const ca = fs.readFileSync(caCertPath)
    const cert = fs.readFileSync(certPath)
    const key = fs.readFileSync(keyPath)

    return { key, cert, ca }
  }

  function GetCACertificate() {
    const { ca } = GetTLSCredentials()

    return ca
  }

  return {
    ReadCertificateCA,
    ReadCertificate,
    RequestCertificateCA,
    RequestCertificateHost,
    RequestCertificateHostKey,
    GetPathCertificateCA,
    GetPathsCertificateHostAndKey,
    GetCACertificate,
    GetTLSCredentials,
  }
}

export { CertificateService }
