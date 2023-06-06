import { ProductType } from '@/types/product-type'

import { apiService } from './axios'

export default function productService() {
  const api = apiService()

  async function GetProducts(productName: string, page: number) {
    const result = await api.get<ProductType[]>(
      `/products/?name_like=${productName}&_page=${page}&_limit=10`
    )
    const response = await result.data

    return { response, nextPage: page }
  }

  async function GetProductBySlug(productSlug: string) {
    const result = await api.get<ProductType[]>(
      `/products/?slug=${productSlug}`
    )
    const response = await result.data

    return response.length > 0 ? response[0] : null
  }

  return { GetProducts, GetProductBySlug }
}
