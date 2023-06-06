import consul from 'consul'
import os from 'os'

import ConfigService from './config-service'

const { GetConfig } = ConfigService()
const config = GetConfig()

export async function NewConsulClient(): Promise<consul.Consul> {
  const consulClient = new consul({
    host: config.consul.split(':')[0],
    port: config.consul.split(':')[1],
    promisify: true,
  })

  register(consulClient).catch(() => {
    return null
  })

  return consulClient
}

async function register(consulClient: consul.Consul) {
  let address = os.hostname()

  const k8s = Boolean(process.env.KUBERNETES)
  if (k8s) address = `${config.appName}-${config.kubernetesServiceNameSuffix}`

  const port = Number(process.env.PORT) || 3000
  const serviceID = `${config.appName}-${address}:${port}`
  const httpCheck = `https://${address}:${port}/api/healthy`
  console.log(httpCheck)

  const service = {
    id: serviceID,
    name: config.appName,
    port: port,
    address: address,
    check: {
      checkid: serviceID,
      name: `Service ${config.appName} check`,
      http: httpCheck,
      tlsskipverify: true,
      interval: '10s',
      timeout: '30s',
      deregistercriticalserviceafter: '30m',
    },
  }

  try {
    await consulClient.agent.service.register(service)
    console.log(`successfully consul register service: web:${port}`)
  } catch (error) {
    console.error(
      `failed consul to register service: ${address}:${port} : `,
      error
    )
  }
}
