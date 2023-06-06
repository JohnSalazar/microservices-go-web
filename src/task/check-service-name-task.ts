import consul from 'consul'

import { ConfigType } from '@/types/config-type'

import { ConsulParse } from '../enums/consul-parse-enum'
import ConfigService from '../services/config-service'
import { NewConsulClient } from '../services/consul-service'

const { GetConfig } = ConfigService()
const config = GetConfig()
let interval = null
let wasSuccessful = false
let consulClient: consul.Consul

async function ReloadServiceName() {
  if (!consulClient) consulClient = await NewConsulClient()

  const services: any[] = await consulClient.catalog.service.nodes(
    config.serviceName
  )

  wasSuccessful = updateConfig(
    config.serviceName,
    config,
    services,
    ConsulParse.CertificatesAndSecurityKeys
  )

  if (!wasSuccessful) {
    console.error(`config update from ${config.serviceName} failed`)
    await sleep(6000)
    return wasSuccessful
  }

  if (interval) clearInterval(interval)
  interval = reRun(config.secondsToReloadServicesName * 1000) // seconds
  return wasSuccessful
}

function reRun(milliseconds) {
  return setInterval(async () => await ReloadServiceName(), milliseconds)
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function updateConfig(
  serviceName: string,
  config: ConfigType,
  services: any[],
  consulParse: ConsulParse
): boolean {
  if (services.length == 0) return false

  const service = services[Math.floor(Math.random() * services.length)]

  const address =
    process.env.NODE_ENV !== 'production' ? 'localhost' : service.ServiceAddress

  const host = `https://${address}:${service.ServicePort}`
  console.log(`host selected: ${host}`)

  switch (consulParse) {
    case ConsulParse.CertificatesAndSecurityKeys:
      config.endPointGetCertificateCA = `${host}/${config.apiPathCertificateCA}`
      config.endPointGetCertificateHost = `${host}/${config.apiPathCertificateHost}`
      config.endPointGetCertificateHostKey = `${host}/${config.apiPathCertificateHostKey}`
      break

    default:
      return false
  }

  return true
}

export { ReloadServiceName }
