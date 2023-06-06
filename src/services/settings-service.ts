import ConfigService from './config-service'

const SettingsService = () => {
  const { GetConfig } = ConfigService()
  const config = GetConfig()

  function getSettings() {
    if (config != null) {
      const settings = localStorage.getItem(config.settingsNameLocalStorage)

      if (settings) {
        return JSON.parse(settings)
      }
    }

    const settings = { darkMode: false }
    setSettings(settings)

    return settings
  }

  function setSettings(settings: any) {
    if (settings && config)
      localStorage.setItem(
        config.settingsNameLocalStorage,
        JSON.stringify(settings)
      )
  }

  return { getSettings, setSettings, config }
}

export default SettingsService
