import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { ToastContainer, Zoom } from 'react-toastify'

import { ApiProvider } from '@/contexts/ApiContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { ColorModeProvider } from '@/contexts/ColorModeContext'
import { SearchProvider } from '@/contexts/SearchContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import SettingsService from '@/services/settings-service'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  const [settings, setSettings] = useState(null)
  const { getSettings } = SettingsService()

  useEffect(() => {
    setSettings(getSettings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SettingsProvider settings={settings}>
      <ApiProvider>
        <AuthProvider>
          <ColorModeProvider settings={settings}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
              <CartProvider>
                <SearchProvider>
                  <Component {...pageProps} />
                </SearchProvider>
              </CartProvider>
            </QueryClientProvider>
          </ColorModeProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            transition={Zoom}
            closeButton={false}
            theme="colored"
          />
        </AuthProvider>
      </ApiProvider>
    </SettingsProvider>
  )
}

export default MyApp
