import { Dispatch, SetStateAction, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  Switch,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { useApi } from '@/contexts/ApiContext'
import ErrorService from '@/services/error-service'
import { CouponType } from '@/types/coupon-type'

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}))

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}))

type ModalAddCouponProps = {
  openModalAddCoupon: boolean
  setOpenModalAddCoupon: Dispatch<SetStateAction<boolean>>
  setCoupons: Dispatch<SetStateAction<CouponType[]>>
  coupons: CouponType[]
}

export default function ModalAddCoupon({
  openModalAddCoupon,
  setOpenModalAddCoupon,
  setCoupons,
  coupons,
}: ModalAddCouponProps) {
  const { couponService } = useApi()
  const { AddCoupon } = couponService
  const { ErrorHandler } = ErrorService()
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setOpenModalAddCoupon(false)
  }

  const add = async (values: CouponType) => {
    setLoading(true)
    await AddCoupon(values)
      .then((res) => {
        if (coupons) {
          setCoupons((coupon) => [...coupon, res])
        } else {
          setCoupons([res])
        }
        setLoading(false)
        setOpenModalAddCoupon(false)
      })
      .catch((err) => {
        ErrorHandler(err)
        setLoading(false)
      })
  }

  return (
    <Dialog
      open={openModalAddCoupon}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'lg'}
    >
      <DialogTitle>Add Coupon</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', placeItems: 'center' }}>
          <Grid
            container
            sx={{
              // maxWidth: '900px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <StyledStack>
              <StyledPaper
                sx={{
                  my: 1,
                  mx: 'auto',
                  p: 2,
                }}
              >
                <Grid item>
                  <Formik
                    initialValues={{
                      id: '',
                      name: '',
                      value: 1,
                      isPercentage: false,
                      quantity: 1,
                      active: true,
                      version: 0,
                      submit: '',
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string().max(150).required('name is required'),
                      value: Yup.number()
                        .min(1)
                        .required('value is required')
                        .positive(),
                      isPercentage: Yup.boolean(),
                      quantity: Yup.number()
                        .min(1)
                        .required('quantity is required')
                        .positive()
                        .integer(),
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
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="name">Name</InputLabel>
                              <OutlinedInput
                                id="name"
                                type="text"
                                value={values.name}
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter name"
                                fullWidth
                                error={Boolean(touched.name && errors.name)}
                              />
                              {touched.name && errors.name && (
                                <FormHelperText error id="error-name">
                                  {errors.name}
                                </FormHelperText>
                              )}
                            </Stack>
                          </Grid>

                          <Grid item xs={12}>
                            <Stack
                              direction="row"
                              justifyContent={'space-around'}
                            >
                              <Grid item xs={4}>
                                <InputLabel htmlFor="value">Value</InputLabel>
                                <OutlinedInput
                                  id="value"
                                  type="number"
                                  value={values.value}
                                  name="value"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  placeholder="Enter value"
                                  fullWidth
                                  startAdornment={
                                    <InputAdornment position="start">
                                      {values.value
                                        ? values.value.getCurrencySymbol()
                                        : '$'}
                                    </InputAdornment>
                                  }
                                  error={Boolean(touched.value && errors.value)}
                                />
                                {touched.value && errors.value && (
                                  <FormHelperText error id="error-value">
                                    {errors.value}
                                  </FormHelperText>
                                )}
                              </Grid>

                              <Grid item xs={4} marginLeft={5}>
                                <InputLabel htmlFor="isPercentage">
                                  Type
                                </InputLabel>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      id="isPercentage"
                                      name="isPercentage"
                                      value={values.isPercentage}
                                      onChange={handleChange}
                                    />
                                  }
                                  label="Percentage ?"
                                />
                                {touched.isPercentage &&
                                  errors.isPercentage && (
                                    <FormHelperText
                                      error
                                      id="error-isPercentage"
                                    >
                                      {errors.isPercentage}
                                    </FormHelperText>
                                  )}
                              </Grid>

                              <Grid item xs={4}>
                                <InputLabel htmlFor="quantity">
                                  Quantity
                                </InputLabel>
                                <OutlinedInput
                                  id="quantity"
                                  type="number"
                                  value={values.quantity}
                                  name="quantity"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  placeholder="Enter quantity"
                                  fullWidth
                                  error={Boolean(
                                    touched.quantity && errors.quantity
                                  )}
                                />
                                {touched.quantity && errors.quantity && (
                                  <FormHelperText error id="error-quantity">
                                    {errors.quantity}
                                  </FormHelperText>
                                )}
                              </Grid>
                            </Stack>
                          </Grid>

                          {errors.submit && (
                            <Grid item xs={12}>
                              <FormHelperText error>
                                {errors.submit}
                              </FormHelperText>
                            </Grid>
                          )}

                          <Grid item xs={12}>
                            <Stack
                              direction="row"
                              justifyContent={'space-around'}
                              flexGrow={1}
                            >
                              <Button
                                type="submit"
                                disabled={loading}
                                variant="contained"
                                fullWidth
                                size="small"
                                color="secondary"
                              >
                                Add Coupon
                              </Button>
                              <Box width={50} />
                              <Button
                                type="button"
                                disabled={loading}
                                variant="contained"
                                fullWidth
                                size="small"
                                onClick={handleClose}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </form>
                    )}
                  </Formik>
                </Grid>
              </StyledPaper>
            </StyledStack>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
