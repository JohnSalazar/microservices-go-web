import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { destroyCookie, parseCookies } from 'nookies'

import AuthenticationService from '@/services/authentication-service'
import ConfigService from '@/services/config-service'
import CustomerService from '@/services/customer-service'
import ErrorService from '@/services/error-service'
import NotificationService from '@/services/notification-service'
import TokenService from '@/services/token-service'
import { CustomerType } from '@/types/customer-type'
import { ReplaceCredentialsType } from '@/types/replace-credentials-type'
import { SigninType } from '@/types/signin-type'
import { SignupType } from '@/types/signup-type'
import { UpdatePasswordType } from '@/types/update-password-type'
import { UserType } from '@/types/user-type'

export const initialUserType: UserType = {
  id: '',
  email: '',
  claims: [],
  version: 0,
}

type AuthContextType = {
  user: UserType | null
  customer: CustomerType | null
  isAuthenticated: boolean
  openModalSignin: boolean
  signIn: (signin: SigninType) => Promise<void>
  signUp: (signup: SignupType) => Promise<void>
  setUser: (user: SetStateAction<UserType | null>) => void
  setCustomer: (user: SetStateAction<CustomerType | null>) => void
  signOut: () => void
  setOpenModalSignin: (value: SetStateAction<boolean>) => void
  requestUpdatePassword: (email: string) => Promise<void>
  updatePassword: (updatePassword: UpdatePasswordType) => Promise<void>
  replaceCredentials: (credentials: ReplaceCredentialsType) => Promise<void>
  isManager: boolean
  setIsManager: Dispatch<SetStateAction<boolean>>
}

type AuthProviderProps = { children: React.ReactNode }

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const { GetConfig } = ConfigService()
  const config = GetConfig()
  const { ReadToken, SetCookieFromToken } = TokenService()
  const { CredentialsUpdate } = NotificationService()

  const [user, setUser] = useState<UserType | null>(null)
  const [customer, setCustomer] = useState<CustomerType | null>(null)
  const [openModalSignin, setOpenModalSignin] = useState(false)
  const [isManager, setIsManager] = useState(false)

  const { Signin, Signup, RequestUpdatePassword, UpdatePassword } =
    AuthenticationService()
  const { ErrorHandler } = ErrorService()

  const isAuthenticated = !!user
  // const avatar = '/me.png'

  useEffect(() => {
    const { [config.accessTokenName]: accessToken } = parseCookies()

    if (accessToken) {
      recoverUserAndCustomer(accessToken)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signIn({ email, password }: SigninType) {
    setOpenModalSignin(false)
    const { accessToken, refreshToken } = await Signin({
      email,
      password,
    })

    if (accessToken && refreshToken) {
      await setCookies(accessToken, refreshToken)
      await recoverUserAndCustomer(accessToken)
    }
  }

  async function signUp({
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
  }: SignupType) {
    const { accessToken, refreshToken, user } = await Signup({
      firstname,
      lastname,
      email,
      password,
      passwordConfirm,
    })

    if (accessToken && refreshToken) {
      await setCookies(accessToken, refreshToken)
      await createProfile(accessToken, email, firstname, lastname)

      setUser(user)
    }
  }

  async function createProfile(
    accessToken: string,
    email: string,
    firstname: string,
    lastname: string
  ) {
    const customer: CustomerType = {
      email,
      firstname,
      lastname,
      avatar: '/me.png',
      version: 0,
    }
    const { AddCustomer } = CustomerService(accessToken)
    await AddCustomer(customer)
      .then((customer) => {
        setCustomer(customer)
      })
      .catch((err) => ErrorHandler(err))
  }

  async function recoverUserAndCustomer(accessToken: string) {
    setUser(null)
    setCustomer(null)
    const token = ReadToken(accessToken)
    if (token) {
      const user: UserType = {
        id: token.sub,
        email: token.email,
        claims: token.claims,
        version: 0,
      }

      setUser(user)
      await recoverCustomer(accessToken)
        .then((customer) => {
          setCustomer(customer)
        })
        .catch((err) => err)
    }
  }

  async function setCookies(accessToken: string, refreshToken: string) {
    SetCookieFromToken(config.accessTokenName, accessToken)
    SetCookieFromToken(config.refreshTokenName, refreshToken)
  }

  async function recoverCustomer(accessToken: string) {
    const customer = CustomerService(accessToken)
    return await customer.GetCustomer()
  }

  async function signOut() {
    destroyCookie(undefined, config.accessTokenName)
    destroyCookie(undefined, config.refreshTokenName)
    setUser(null)
    setCustomer(null)
  }

  async function requestUpdatePassword(email: string) {
    await signOut()
    // await RequestUpdatePassword(email).catch((err) => ErrorHandler(err))
    await RequestUpdatePassword(email)
  }

  async function updatePassword(updatePassword: UpdatePasswordType) {
    await UpdatePassword(updatePassword).then(async (response) => {
      const { accessToken, refreshToken } = response

      if (accessToken && refreshToken) {
        await setCookies(accessToken, refreshToken)
        await recoverUserAndCustomer(accessToken)
      }
    })
  }

  async function replaceCredentials({
    accessToken,
    refreshToken,
  }: ReplaceCredentialsType) {
    if (accessToken && refreshToken) {
      CredentialsUpdate()
      await setCookies(accessToken, refreshToken)
      await recoverUserAndCustomer(accessToken)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        customer,
        isAuthenticated,
        openModalSignin,
        requestUpdatePassword,
        updatePassword,
        signIn,
        signUp,
        setUser,
        setCustomer,
        signOut,
        setOpenModalSignin,
        replaceCredentials,
        isManager,
        setIsManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
