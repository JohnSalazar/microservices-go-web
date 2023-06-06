import fs from 'fs'

import CertificateManager from '../manager/certificate-manager'
import CertificateService from '../services/certificate-service'
import ConfigService from '../services/config-service'

const { GetCertificateCA, GetCertificate, VerifyCertificates } =
  CertificateManager()

const { GetPathCertificateCA, GetPathsCertificateHostAndKey } =
  CertificateService()

const { GetConfig } = ConfigService()
const config = GetConfig()
let interval = null
let wasSuccessful = false

async function Start() {
  const isValid = await VerifyCertificates()

  if (!isValid) {
    const caCert = await GetCertificateCA()
    const cert = await GetCertificate()

    if (!caCert || !cert) {
      // SendSupportMessage('certificate service is down')

      // console.log(`ticker 6 seconds: ${new Date().toLocaleTimeString()}`)
      if (wasSuccessful) {
        clearInterval(interval)
        interval = reRun(6000) // 6 seconds
      } else {
        if (!interval) await sleep(6000)
      }

      wasSuccessful = false
      return wasSuccessful
    }
  }

  setCertificates()

  // console.log(`ticker 1 minute: ${new Date().toLocaleTimeString()}`)
  wasSuccessful = true
  if (interval) clearInterval(interval)
  interval = reRun(config.minutesToReloadCertificate * 60 * 1000) // minutes
  return wasSuccessful
}

function reRun(milliseconds) {
  return setInterval(async () => await Start(), milliseconds)
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function setCertificates() {
  const { certPath, keyPath } = GetPathsCertificateHostAndKey()
  const { caCertPath } = GetPathCertificateCA()

  process.env.TLS_KEY = fs.readFileSync(keyPath).toString()
  process.env.TLS_CERT = fs.readFileSync(certPath).toString()
  process.env.TLS_CA = fs.readFileSync(caCertPath).toString()
}

export { Start }
