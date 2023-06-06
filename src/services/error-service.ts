import { useAuth } from '@/contexts/AuthContext'

import NotificationService from './notification-service'

export default function ErrorService() {
  const { setOpenModalSignin } = useAuth()
  const { Error, AccessDenied, LoginFailure } = NotificationService()

  function ErrorHandler(err: any) {
    const status: number = err.response?.status

    switch (status) {
      case 400:
        if (String(err.response.config.url).endsWith('/refresh-token')) {
          setOpenModalSignin(true)
          break
        }
        if (String(err.response.config.url).endsWith('/signin')) {
          LoginFailure(err.response.data.error)
          break
        }
        Error(err.response.data.error)
        break
      case 401:
        setOpenModalSignin(true)
        break
      case 403:
        AccessDenied()
        break
      default:
        Error(err.message)
        break
    }
  }

  return { ErrorHandler }
}
