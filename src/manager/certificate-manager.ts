import fs from 'fs'

import CertificateService from '../services/certificate-service'
import ConfigService from '../services/config-service'

export default function CertificateManager() {
  const {
    ReadCertificateCA,
    ReadCertificate,
    RequestCertificateCA,
    RequestCertificateHost,
    RequestCertificateHostKey,
    GetPathCertificateCA,
    GetPathsCertificateHostAndKey,
  } = CertificateService()

  const { caCertPath } = GetPathCertificateCA()
  const { certPath, keyPath } = GetPathsCertificateHostAndKey()
  const { GetConfig } = ConfigService()
  const config = GetConfig()

  async function VerifyCertificates() {
    const hasCACertFile = fs.existsSync(caCertPath)
    const hasCertFile = fs.existsSync(certPath)
    const hasCertKeyFile = fs.existsSync(keyPath)

    if (hasCACertFile && hasCertFile && hasCertKeyFile) {
      const caCert = await ReadCertificateCA()
      const certHost = await ReadCertificate()

      return caCert && certHost && validCertificateDate(certHost.validTo)
    }

    return false
  }

  async function GetCertificateCA() {
    return await refreshCertificateCA()
  }

  async function GetCertificate() {
    return await refreshCertificate()
  }

  async function refreshCertificateCA() {
    const isCACertificate = await requestCertificateCA()

    return isCACertificate
  }

  async function refreshCertificate() {
    const isCertificate = await requestCertificate()
    const isCertificateKey = await requestCertificateKey()

    return isCertificate && isCertificateKey
  }

  async function requestCertificateCA() {
    try {
      const caCert = await RequestCertificateCA()
      if (!caCert) return false
      checkFolderCertsExists()
      fs.writeFileSync(caCertPath, caCert)
      return true
    } catch (err) {
      return false
    }
  }

  async function requestCertificate() {
    try {
      const cert = await RequestCertificateHost()
      if (!cert) return false
      checkFolderCertsExists()
      fs.writeFileSync(certPath, cert)
      return true
    } catch (err) {
      return false
    }
  }

  async function requestCertificateKey() {
    try {
      const key = await RequestCertificateHostKey()
      if (!key) return false
      checkFolderCertsExists()
      fs.writeFileSync(keyPath, key)
      return true
    } catch (err) {
      // console.error('requestCertificateKey error: ', err)
      return false
    }
  }

  function validCertificateDate(certValidTo) {
    const certDateUTC = new Date(certValidTo)
    const dateNowUTC = new Date()

    const result = certDateUTC >= dateNowUTC
    return result
  }

  function checkFolderCertsExists() {
    if (!fs.existsSync(`${config.certificateFolderName}`)) {
      fs.mkdirSync(`${config.certificateFolderName}`)
    }
  }

  return { VerifyCertificates, GetCertificateCA, GetCertificate }
}
