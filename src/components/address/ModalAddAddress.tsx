import { Dispatch, SetStateAction, useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { useApi } from '@/contexts/ApiContext'
import { TypeAddress } from '@/enums/type-address-enum'
import ErrorService from '@/services/error-service'
import { AddressType } from '@/types/address-type'

const StyledGrid = styled(Grid)(({ theme }) => ({
  paddingTop: '24px',
  paddingLeft: '24px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
}))

type ModalAddAddressProps = {
  openModalAddAddress: boolean
  setOpenModalAddAddress: Dispatch<SetStateAction<boolean>>
  setAddresses: Dispatch<SetStateAction<AddressType[]>>
  addresses: AddressType[]
}

export default function ModalAddAddress({
  openModalAddAddress,
  setOpenModalAddAddress,
  setAddresses,
  addresses,
}: ModalAddAddressProps) {
  const { customerService } = useApi()
  const { AddAddress } = customerService
  const { ErrorHandler } = ErrorService()
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setOpenModalAddAddress(false)
  }

  const add = async (values: AddressType) => {
    setLoading(true)
    await AddAddress(values)
      .then((res) => {
        if (addresses) {
          setAddresses((address) => [...address, res])
        } else {
          setAddresses([res])
        }
        setLoading(false)
        setOpenModalAddAddress(false)
      })
      .catch((err) => {
        ErrorHandler(err)
        setLoading(false)
      })
  }

  return (
    <Dialog
      open={openModalAddAddress}
      onClose={handleClose}
      fullWidth
      maxWidth={'lg'}
    >
      <DialogContent>
        <div>
          <Typography
            variant="h6"
            sx={{
              margin: '0 0 24px',
            }}
          >
            Address Information
          </Typography>
          <Formik
            initialValues={{
              id: '',
              customerId: '',
              street: '',
              province: '',
              city: '',
              code: '',
              type: TypeAddress.Home,
              version: 0,
              submit: '',
            }}
            validationSchema={Yup.object().shape({
              street: Yup.string().max(300).required('street is required'),
              province: Yup.string().max(150).required('province is required'),
              city: Yup.string().max(150).required('city is required'),
              code: Yup.string().max(20).required('code is required'),
              type: Yup.mixed<TypeAddress>()
                .oneOf(Object.values(TypeAddress))
                .required('type address is required'),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              try {
                setStatus({ success: false })
                setSubmitting(false)
                add(values)
              } catch (err: any) {
                setStatus({ success: false })
                setErrors({ submit: err.message })
                setSubmitting(false)
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleSubmit,
              handleChange,
              touched,
              values,
            }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid
                  container
                  sx={{
                    marginTop: '-24px',
                    width: 'calc(100% + 24px)',
                    marginLeft: '-24px',
                  }}
                >
                  <StyledGrid item>
                    <FormControl fullWidth>
                      <TextField
                        id="type"
                        select
                        value={values.type}
                        defaultValue={values.type}
                        name="type"
                        label="Type address"
                        color="error"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={Boolean(touched.type && errors.type)}
                      >
                        {Object.values(TypeAddress).map((typeAddress) => (
                          <MenuItem key={typeAddress} value={typeAddress}>
                            {typeAddress.toUpperCase()}
                          </MenuItem>
                        ))}
                      </TextField>
                      {touched.type && errors.type && (
                        <FormHelperText error id="error-type">
                          {errors.type}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </StyledGrid>
                  <StyledGrid item></StyledGrid>
                  <StyledGrid item>
                    <FormControl fullWidth>
                      <TextField
                        id="street"
                        type="text"
                        value={values.street}
                        name="street"
                        label="Street"
                        color="error"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={Boolean(touched.street && errors.street)}
                      />
                      {touched.street && errors.street && (
                        <FormHelperText error id="error-street">
                          {errors.street}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </StyledGrid>
                  <StyledGrid item>
                    <FormControl fullWidth>
                      <TextField
                        id="city"
                        type="text"
                        value={values.city}
                        name="city"
                        label="City"
                        color="error"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={Boolean(touched.city && errors.city)}
                      />
                      {touched.city && errors.city && (
                        <FormHelperText error id="error-city">
                          {errors.city}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </StyledGrid>
                  <StyledGrid item>
                    <FormControl fullWidth>
                      <TextField
                        id="province"
                        type="text"
                        value={values.province}
                        name="province"
                        label="Province"
                        color="error"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={Boolean(touched.province && errors.province)}
                      />
                      {touched.province && errors.province && (
                        <FormHelperText error id="error-province">
                          {errors.province}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </StyledGrid>
                  <StyledGrid item>
                    <FormControl fullWidth>
                      <TextField
                        id="code"
                        type="text"
                        value={values.code}
                        name="code"
                        label="Postal Code"
                        color="error"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={Boolean(touched.code && errors.code)}
                      />
                      {touched.code && errors.code && (
                        <FormHelperText error id="error-code">
                          {errors.code}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </StyledGrid>

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}

                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      paddingTop: '24px',
                      paddingLeft: '24px',
                      width: '100%',
                    }}
                  >
                    <FormControl sx={{ marginRight: '24px' }}>
                      <Button
                        type="submit"
                        disabled={loading}
                        variant="contained"
                        color="error"
                        sx={{
                          textTransform: 'capitalize',
                        }}
                      >
                        Add Address
                      </Button>
                    </FormControl>
                    <FormControl>
                      <Button
                        variant="outlined"
                        disabled={loading}
                        color="error"
                        sx={{
                          textTransform: 'capitalize',
                        }}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  )
}
