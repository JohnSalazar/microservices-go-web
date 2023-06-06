import { createContext, useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'

import createMUITheme from '@/themes/mui-theme'

import { useSettings } from './SettingsContext'

export interface ColorModeProps {
  settings: any
  children: React.ReactNode
}

const ColorModeContext = createContext({
  toggleColorMode: () => {
    undefined
  },
})

export const ColorModeProvider = ({ settings, children }: ColorModeProps) => {
  const { saveSettings } = useSettings()
  const [darkMode, setDarkMode] = useState(settings?.darkMode)

  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          setDarkMode(!darkMode)
          saveSettings({ darkMode: !darkMode })

          return prevMode === 'light' ? 'dark' : 'light'
        })
      },
    }),
    [darkMode, saveSettings]
  )

  const theme = useMemo(
    () =>
      createMUITheme({
        darkMode: darkMode,
        palette: {
          mode,
        },
      }),
    [darkMode, mode]
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default ColorModeContext
