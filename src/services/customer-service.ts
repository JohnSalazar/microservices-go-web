import { AddressType } from '@/types/address-type'
import { CustomerType } from '@/types/customer-type'

import { apiService } from './axios'

export interface ICustomerService {
  GetCustomer(): Promise<CustomerType>
  AddCustomer(customer: CustomerType): Promise<CustomerType>
  UpdateCustomer(customer: CustomerType): Promise<CustomerType>
  GetAddresses(): Promise<AddressType[]>
  GetAddress(id: string): Promise<AddressType>
  AddAddress(address: AddressType): Promise<AddressType>
  UpdateAddress(address: AddressType): Promise<AddressType>
  RemoveAddress(id: string): Promise<string>
}

export default function CustomerService(accessToken?: string) {
  const api = apiService(accessToken)

  async function GetCustomer() {
    const result = await api.get<CustomerType>(`/customers/api/v1/profile`)
    const response = await result.data
    return response
  }

  async function AddCustomer(customer: CustomerType) {
    const result = await api.post<CustomerType>(`/customers/api/v1/`, customer)
    const response = await result.data
    return response
  }

  async function UpdateCustomer(customer: CustomerType) {
    const result = await api.put<CustomerType>(`/customers/api/v1/`, customer)
    const response = await result.data

    return response
  }

  async function GetAddresses() {
    const result = await api.get<AddressType[]>(`/customers/api/v1/addresses`)
    const response = await result.data

    return response
  }

  async function GetAddress(id: string) {
    const result = await api.get<AddressType>(`/customers/api/v1/address/${id}`)
    const response = await result.data

    return response
  }

  async function AddAddress(address: AddressType) {
    const result = await api.post<AddressType>(
      `/customers/api/v1/address`,
      address
    )
    const response = await result.data
    return response
  }

  async function UpdateAddress(address: AddressType) {
    const result = await api.put<AddressType>(
      `/customers/api/v1/address/${address.id}`,
      address
    )
    const response = await result.data

    return response
  }

  async function RemoveAddress(id: string) {
    const result = await api.delete<string>(`/customers/api/v1/address/${id}`)
    const response = await result.data

    return response
  }

  return {
    GetCustomer,
    AddCustomer,
    UpdateCustomer,
    GetAddresses,
    GetAddress,
    AddAddress,
    UpdateAddress,
    RemoveAddress,
  }
}
