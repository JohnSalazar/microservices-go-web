import { BookType } from '@/types/book-type'
import { GetProductResponseType } from '@/types/get-product-response-type'
import { PaymentType } from '@/types/payment-type'
import { ProductType } from '@/types/product-type'

import { apiService } from './axios'

export interface IProductService {
  GetProducts(
    productName: string,
    page: number,
    size: number
  ): Promise<GetProductResponseType>
  GetProductById(productId: string): Promise<ProductType>
  GetProductBySlug(productSlug: string): Promise<ProductType>
  AddProduct(product: ProductType): Promise<ProductType>
  UpdateProduct(product: ProductType): Promise<ProductType>
  Book(book: BookType): Promise<BookType>
  Payment(payment: PaymentType): Promise<PaymentType>
}

export default function ProductService() {
  const api = apiService()

  async function GetProducts(productName: string, page: number, size: number) {
    const result = await api.get<ProductType[]>(
      `/products/api/v1/${productName}/${page}/${size}`
    )
    const response = await result.data

    return { response, nextPage: page }
  }

  async function GetProductById(productId: string) {
    const result = await api.get<ProductType>(
      `/products/api/v1/id/${productId}`
    )
    const response = await result.data

    return response
  }

  async function GetProductBySlug(productSlug: string) {
    const result = await api.get<ProductType>(
      `/products/api/v1/slug/${productSlug}`
    )
    const response = await result.data

    return response
  }

  async function AddProduct(product: ProductType) {
    const result = await api.post<ProductType>(`/products/api/v1/`, product)
    const response = await result.data
    return response
  }

  async function UpdateProduct(product: ProductType) {
    const result = await api.put<ProductType>(
      `/products/api/v1/${product.id}`,
      product
    )
    const response = await result.data
    return response
  }

  async function Book(book: BookType) {
    const result = await api.post<BookType>(`/products/api/v1/book`, book)
    const response = await result.data
    return response
  }

  async function Payment(payment: PaymentType) {
    const result = await api.post<PaymentType>(
      `/products/api/v1/payment`,
      payment
    )
    const response = await result.data
    return response
  }

  return {
    GetProducts,
    GetProductById,
    GetProductBySlug,
    AddProduct,
    UpdateProduct,
    Book,
    Payment,
  }
}
