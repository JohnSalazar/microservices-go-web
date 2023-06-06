import { colors, createTheme, ThemeOptions } from '@mui/material'

const themes = [
  {
    darkMode: false,
    palette: {
      mode: 'light',
      // primary: {
      //   dark: colors.grey.A400,
      //   main: colors.grey.A100,
      //   light: colors.grey.A100,
      // },
      secondary: {
        dark: colors.blue.A200,
        main: colors.blue.A200,
        light: colors.blue.A100,
      },
      // background: {
      //   default: '#F6F9FC',
      //   dark: '#f4f6f8',
      //   paper: colors.common.white,
      // },
      text: {
        primary: '#0F1111',
        secondary: 'colors.blueGrey[600]',
      },
    },
  },
  {
    darkMode: true,
    palette: {
      mode: 'dark',
      primary: {
        dark: colors.indigo.A700,
        main: colors.indigo.A400,
        light: colors.indigo.A200,
      },
      secondary: {
        dark: colors.blue.A200,
        main: colors.blue.A200,
        light: colors.blue.A100,
      },
      background: {
        default: '#282C34',
        dark: '#1c2025',
        paper: '#282C34',
      },
      text: {
        primary: '#e6e5e8',
        secondary: '#adb0bb',
      },
    },
  },
]

export default function createMUITheme(settings = {} as any) {
  const themeConfig = themes.find(
    (theme) => theme.darkMode === settings.darkMode
  )

  const theme = createTheme(themeConfig as ThemeOptions)

  return theme
}
