import { createContext, useContext, useState } from 'react'

import SettingsService from '@/services/settings-service'

type SettingsContextType = {
  settings: any
  saveSettings: (newSettings: any) => void
}

type SettingsProps = {
  settings: any
  children: React.ReactNode
}

const SettingsContext = createContext({} as SettingsContextType)

const defaultSettings = {
  darkMode: false,
}

export function SettingsProvider({ settings, children }: SettingsProps) {
  const [currentSettings, setCurrentSettings] = useState(
    settings || defaultSettings
  )
  const { setSettings } = SettingsService()

  const handleSave = (newSettings: any) => {
    const mergedSettings = Object.assign({}, currentSettings, newSettings)

    setCurrentSettings(mergedSettings)
    setSettings(mergedSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        saveSettings: handleSave,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  return context
}
