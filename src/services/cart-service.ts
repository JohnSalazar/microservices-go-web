import { CartType } from '@/types/cart-type'

import { apiService } from './axios'
import SettingsService from './settings-service'

export interface ICartService {
  GetCart(): Promise<CartType>
  AddCart(cart: CartType): Promise<CartType>
  UpdateCart(cart: CartType): Promise<CartType>
  FinalizeCart(cart: CartType): Promise<CartType>
  SetLocalStore(cartId: string, cart: CartType): Promise<void>
  GetLocalStore(cartId: string): Promise<any>
  RemoveLocalStore(cartId?: string): void
}

export default function CartService(accessToken: string) {
  const api = apiService(accessToken)
  const { config } = SettingsService()

  async function GetCart() {
    const result = await api.get<CartType>(`/carts/api/v1/`)
    const response = await result.data

    return response
  }

  async function AddCart(cart: CartType) {
    const result = await api.post<CartType>(`/carts/api/v1/`, cart)
    const response = await result.data

    return response
  }

  async function UpdateCart(cart: CartType) {
    const result = await api.put<CartType>(`/carts/api/v1/${cart.id}`, cart)
    const response = await result.data

    return response
  }

  async function FinalizeCart(cart: CartType) {
    const result = await api.put<CartType>(
      `/carts/api/v1/finalize/${cart.id}`,
      cart
    )
    const response = await result.data

    return response
  }

  async function SetLocalStore(cartId: string, cart: CartType) {
    if (!cart || !cartId) return

    const cartName = getCartNameLocalStorage(cartId)

    if (cartName) localStorage.setItem(cartName, JSON.stringify(cart))
  }

  async function GetLocalStore(cartId: string) {
    if (!cartId) return

    const cartName = getCartNameLocalStorage(cartId)
    if (!cartName) return

    const cart = localStorage.getItem(cartName)
    if (!cart) return

    return JSON.parse(cart)
  }

  async function RemoveLocalStore(cartId: string) {
    if (!cartId) return

    const cartName = getCartNameLocalStorage(cartId)
    if (cartName) localStorage.removeItem(cartName)
  }

  function getCartNameLocalStorage(cartId: string) {
    return config.cartNameLocalStorage + '.' + cartNameEncoded(cartId)
  }

  function cartNameEncoded(cartId: string) {
    const emailSplitted = cartId.split('')
    let sumElements = 0

    emailSplitted.map((e) => {
      sumElements += e.charCodeAt(0)
    })

    const data = String(sumElements * 795)
    const buff = Buffer.from(data)
    const base64 = buff.toString('base64')

    return base64
  }

  return {
    GetCart,
    AddCart,
    UpdateCart,
    FinalizeCart,
    SetLocalStore,
    GetLocalStore,
    RemoveLocalStore,
  }
}
