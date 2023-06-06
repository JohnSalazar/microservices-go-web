import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { parseCookies } from 'nookies'

import { initialCartType } from '@/components/Cart'
import CartService from '@/services/cart-service'
import ErrorService from '@/services/error-service'
import { CartType } from '@/types/cart-type'
import { ProductType } from '@/types/product-type'

import { useAuth } from './AuthContext'

type CartContextType = {
  cart: CartType
  setCart: (value: SetStateAction<CartType>) => void
  addProduct: (product: ProductType) => void
  removeProduct: (index: number) => void
  updateProduct: (index: number, product: ProductType) => void
  payment: () => Promise<CartType>
  reset: () => void
}

type CartProps = { children: React.ReactNode }

const CartContext = createContext({} as CartContextType)

export function CartProvider({ children }: CartProps) {
  const { accessToken } = parseCookies()
  const api = CartService(accessToken)

  const { isAuthenticated, user, setOpenModalSignin } = useAuth()
  const { ErrorHandler } = ErrorService()

  const [cart, setCart] = useState<CartType>(initialCartType)

  useEffect(() => {
    if (isAuthenticated) loadCart()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const loadCart = () => {
    setCart(initialCartType)
    api
      .GetCart()
      .then((cart) => {
        const _cart = mapperCart(cart)
        setCart(_cart)
        if (user?.email) api.SetLocalStore(user.email, _cart)
      })
      .catch((err) => err)

    if (!cart) {
      if (user?.email) {
        api.GetLocalStore(user.email).then((cart) => {
          setCart(cart)
        })
      }
    }
  }

  const addProduct = (product: ProductType) => {
    if (!isAuthenticated) {
      setOpenModalSignin(true)
      return
    }

    if (!cart) {
      const _newCart: CartType = {
        products: [product],
        shipping: 0,
        discount: 0,
      }
      setCart(_newCart)
    }

    if (!cart?.products) {
      cart.products = [product]
    } else {
      cart.products.push(product)
    }

    if (!cart.id) {
      api
        .AddCart(cart)
        .then((cart) => {
          const _cart = mapperCart(cart)
          setCart(_cart)
        })
        .catch((err) => {
          ErrorHandler(err)
        })
    } else {
      updateCart(cart)
    }

    if (user?.email) api.SetLocalStore(user.email, cart)
  }

  const removeProduct = (index: number) => {
    const p = cart.products.filter((_, i) => i != index)
    cart.products = p
    // setCart((prevState) => ({ ...prevState, cart }))

    updateCart(cart)

    if (user?.email) api.SetLocalStore(user.email, cart)
  }

  const updateProduct = (index: number, product: ProductType) => {
    const p = cart.products
    p[index] = product
    cart.products = p
    // setCart((prevState) => ({ ...prevState, cart }))

    updateCart(cart)

    if (user?.email) api.SetLocalStore(user.email, cart)
  }

  const updateCart = (cart: CartType) => {
    api
      .UpdateCart(cart)
      .then((res) => {
        const _cart = mapperCart(res)
        setCart(_cart)
      })
      .catch((err) => {
        ErrorHandler(err)
      })
  }

  const mapperCart = (cart: CartType) => {
    const _cart: CartType = {
      id: cart.id,
      products: cart.products,
      shipping: cart.shipping,
      discount: cart.discount,
      version: cart.version,
    }

    return _cart
  }

  async function payment() {
    return await api.FinalizeCart(cart)
  }

  const reset = () => {
    if (user) {
      api.RemoveLocalStore(user.email)
      setCart({
        id: undefined,
        couponId: undefined,
        products: [],
        discount: 0,
        shipping: 0,
        cardNumber: undefined,
        version: 0,
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addProduct,
        removeProduct,
        updateProduct,
        payment,
        reset,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  return context
}
