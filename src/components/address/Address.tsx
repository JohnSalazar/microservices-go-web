import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Radio,
  radioClasses,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

import { useApi } from '@/contexts/ApiContext'
import { useCart } from '@/contexts/CartContext'
import { TypeAddress } from '@/enums/type-address-enum'
import ErrorService from '@/services/error-service'
import { AddressType } from '@/types/address-type'
import { CartType } from '@/types/cart-type'

import ModalAddAddress from './ModalAddAddress'
import ModalUpdateAddress from './ModalUpdateAddress'

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}))

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    minWidth: '780px',
  },
}))

export const initialAddressType: AddressType = {
  id: '',
  customerId: '',
  street: '',
  province: '',
  city: '',
  code: '',
  type: TypeAddress.Home,
  version: 0,
}

type AddressProps = {
  addressId: string | null
  setAddressId: Dispatch<SetStateAction<string | null>>
}

export default function Address({ addressId, setAddressId }: AddressProps) {
  const { customerService } = useApi()
  const { cart, setCart } = useCart()
  const { GetAddresses, RemoveAddress } = customerService

  const { ErrorHandler } = ErrorService()

  const [addresses, setAddresses] = useState<AddressType[]>([])
  const [address, setAddress] = useState<AddressType>(initialAddressType)
  const [loading, setLoading] = useState(false)

  const [openModalAddAddress, setOpenModalAddAddress] = useState(false)
  const [openModalUpdateAddress, setOpenModalUpdateAddress] = useState(false)

  const handleOpenModalAddAddress = () => {
    setOpenModalAddAddress(true)
  }

  const handleOpenModalUpdateAddress = (address: AddressType) => {
    setAddress(address)
    setOpenModalUpdateAddress(true)
  }

  const updateAddressFromAddressesList = async (address: AddressType) => {
    const addressIndex = addresses.findIndex(
      (addresses) => addresses.id == address.id
    )
    addresses[addressIndex] = address
    setAddresses(addresses)
  }

  const removeAddressFromAddressesList = (id: string) => {
    const _addresses = addresses.filter((address) => address.id != id)
    setAddresses(_addresses)
  }

  useEffect(() => {
    setLoading(true)
    GetAddresses()
      .then((res) => {
        setAddresses(res)
      })
      .catch((err) => ErrorHandler(err))
    setLoading(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickRemove = (id: string) => {
    setLoading(true)
    RemoveAddress(id)
      .then(() => {
        if (id == addressId) setAddressId(null)
        removeAddressFromAddressesList(id)
      })
      .catch((err) => ErrorHandler(err))
    setLoading(false)
  }

  return (
    <>
      <Grid container>
        <Paper
          elevation={1}
          sx={{
            borderRadius: '8px',
            padding: '1.5rem 1.75rem',
            marginBottom: '24px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '28px',
              }}
            >
              <Avatar sx={{ bgcolor: '#D32F2F' }}>1</Avatar>
              <Typography fontSize={20}>Delivery Address</Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpenModalAddAddress}
            >
              New address
            </Button>
          </Box>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              marginBottom: '12px',
            }}
          >
            Delivery addresses
          </Typography>
          <Grid container>
            <Grid item>
              <RadioGroup
                name="address"
                // defaultChecked
                sx={{
                  [`& .${radioClasses.root}`]: {
                    // display: 'contents',
                  },
                  // maxWidth: '50px',
                }}
              >
                <StyledStack>
                  <StyledGrid container spacing={1}>
                    {addresses?.map((address) => (
                      <Grid key={address.id} item>
                        {/* <Grid
                        item
                        sx={{
                          // maxWidth: '900px',
                          margin: '0 auto',
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}
                      > */}
                        <Paper
                          elevation={1}
                          sx={{
                            borderRadius: '8px',
                            padding: '16px',
                            boxShadow: 'none',
                            cursor: 'pointer',
                            border: '1px solid transparent',
                            backgroundColor: 'background.default',
                            position: 'relative',
                            minWidth: '330px',
                          }}
                        >
                          <Radio
                            id={address.id}
                            value={address.id}
                            checkedIcon={<CheckCircleRoundedIcon />}
                            icon={<RadioButtonUncheckedIcon />}
                            color="error"
                            onClick={() => {
                              setAddressId(address.id)
                              cart.shipping = checkShipping(cart)
                              setCart(cart)
                            }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                            }}
                          >
                            <IconButton
                              disabled={loading}
                              onClick={() =>
                                handleOpenModalUpdateAddress(address)
                              }
                            >
                              <EditIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                            <IconButton
                              sx={{ color: '#D32F2F' }}
                              disabled={loading}
                              onClick={() => handleClickRemove(address.id)}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              marginBottom: '4px',
                              marginTop: '0px',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            {address.type.toUpperCase()}
                          </Typography>
                          <Typography
                            sx={{
                              marginBottom: '0px',
                              marginTop: '0px',
                              fontSize: '14px',
                            }}
                          >
                            {address.street}, {address.city}, {address.province}
                          </Typography>
                          <Typography
                            sx={{
                              marginBottom: '0px',
                              marginTop: '0px',
                              fontSize: '14px',
                            }}
                          >
                            {address.code}
                          </Typography>
                        </Paper>
                        {/* </Grid> */}
                      </Grid>
                    ))}
                  </StyledGrid>
                </StyledStack>
              </RadioGroup>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <ModalAddAddress
        openModalAddAddress={openModalAddAddress}
        setOpenModalAddAddress={setOpenModalAddAddress}
        setAddresses={setAddresses}
        addresses={addresses}
      />
      <ModalUpdateAddress
        openModalUpdateAddress={openModalUpdateAddress}
        setOpenModalUpdateAddress={setOpenModalUpdateAddress}
        address={address}
        updateAddressFromAddressesList={updateAddressFromAddressesList}
      />
    </>
  )
}

const checkShipping = (cart: CartType): number => {
  return cart.products?.length == 1 ? shippingValue() : 0
}

const shippingValue = () => {
  const max = 70
  const min = 10
  return Math.floor(Math.random() * (max - min + 1)) + min
}
