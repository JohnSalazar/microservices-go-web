export type ConfigType = {
  appName: string
  kubernetesServiceNameSuffix?: string
  settingsNameLocalStorage: string
  cartNameLocalStorage: string
  endPoint: string
  accessTokenName: string
  refreshTokenName: string
  folderNameProductImage: string
  defaultProductImage: string
  folderNameAvatarImage: string
  defaultAvatarImage: string
  certificateFolderName: string
  certificateFileName: string
  certificateKeyFileName: string
  serviceName?: string
  apiPathCertificateCA: string
  endPointGetCertificateCA: string
  apiPathCertificateHost: string
  endPointGetCertificateHost: string
  apiPathCertificateHostKey: string
  endPointGetCertificateHostKey: string
  minutesToReloadCertificate: number
  passwordPermissionEndPoint?: string
  port: string
  secondsToReloadServicesName?: number
  consul?: string
}
