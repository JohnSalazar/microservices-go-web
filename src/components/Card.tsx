import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import * as Yup from 'yup'

import { useApi } from '@/contexts/ApiContext'
import { useCart } from '@/contexts/CartContext'
import ErrorService from '@/services/error-service'
import NotificationService from '@/services/notification-service'

import { sumPay } from './Cart'

const StyledGrid = styled(Grid)(({ theme }) => ({
  paddingTop: '24px',
  paddingLeft: '24px',
  maxWidth: '100%',
  flexBasis: '100%',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '50%',
    flexBasis: '50%',
    flexGrow: '0',
  },
}))

type CardProps = {
  addressId: string | null
  setFinalized: Dispatch<SetStateAction<boolean>>
}

export default function Card({ addressId, setFinalized }: CardProps) {
  const months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ]

  const years = () => {
    let currentYear = new Date().getFullYear()
    const newYears: string[] = []
    for (let a = 0; a < 10; a++) {
      newYears.push(String(currentYear++))
    }

    return newYears
  }

  const router = useRouter()
  const { couponService } = useApi()
  const { cart, setCart, payment, reset } = useCart()
  const { GetCouponByName } = couponService
  const { ErrorHandler } = ErrorService()
  const { DeliveryAddress, SendPayment } = NotificationService()

  const [applyCoupon, setApplyCoupon] = useState(false)
  const [couponName, setCouponName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    resetCartValues()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    resetCartValues()
    calculateCoupon()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.products])

  const resetCartValues = () => {
    addressId = null
    setCart({ ...cart, couponId: undefined, discount: 0, shipping: 0 })
  }

  const handleCoupon = () => {
    if (applyCoupon) {
      setCart({ ...cart, couponId: undefined, discount: 0 })
      setCouponName('')
    }

    setApplyCoupon(!applyCoupon)
  }

  const calculateCoupon = async () => {
    setLoading(true)
    if (couponName?.length == 0) {
      setCart({
        ...cart,
        couponId: undefined,
        discount: 0,
      })
      setLoading(false)
      return
    }

    GetCouponByName(couponName)
      .then((res) => {
        if (res) {
          cart.couponId = res.id

          const totalCart = sumPay(cart)
          let discount = res.value
          if (res.isPercentage) discount = totalCart * (res.value / 100)

          setCart({
            ...cart,
            couponId: res.id,
            discount: discount,
          })
        }
      })
      .catch((err) => {
        ErrorHandler(err)
      })
    setLoading(false)
  }

  const sendPayment = () => {
    if (!addressId) {
      DeliveryAddress()
      return
    }

    cart.cardNumber = cardNumber
    payment()
      .then(() => {
        reset()
        setCouponName('')
        setApplyCoupon(false)
        setCardNumber('')
        setFinalized(true)
        SendPayment()
        setTimeout(() => {
          router.push('/orders')
        }, 3000)
      })
      .catch((err) => ErrorHandler(err))
  }

  return (
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
            <Avatar sx={{ bgcolor: '#D32F2F' }}>2</Avatar>
            <Typography fontSize={20}>Payment Details</Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              marginBottom: '12px',
            }}
          >
            Card Information
          </Typography>
          <Formik
            initialValues={{
              name: '',
              cardnumber: '',
              month: '',
              year: '',
              code: '',
              submit: '',
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().min(1).max(50).required('name is required'),
              cardnumber: Yup.string()
                .length(16)
                .required('number is required'),
              month: Yup.string().length(2).required('month is required'),
              year: Yup.string().length(4).required('year is required'),
              code: Yup.number()
                .positive()
                .integer()
                .required('code is required'),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              try {
                setStatus({ success: false })
                setSubmitting(false)
                sendPayment()
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
                    <FormControl
                      sx={{
                        width: '100%',
                      }}
                    >
                      <TextField
                        id="name"
                        type="text"
                        value={values.name}
                        name="name"
                        label="Name as on card"
                        variant="outlined"
                        color="error"
                        size="small"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={Boolean(touched.name && errors.name)}
                      />
                      {touched.name && errors.name && (
                        <FormHelperText error id="error-name">
                          {errors.name}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </StyledGrid>
                  <StyledGrid item>
                    <FormControl
                      sx={{
                        width: '100%',
                      }}
                    >
                      <TextField
                        id="cardnumber"
                        type="text"
                        value={values.cardnumber}
                        name="cardnumber"
                        label="Card number"
                        variant="outlined"
                        color="error"
                        size="small"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e)
                          setCardNumber(e.target.value)
                        }}
                        error={Boolean(touched.cardnumber && errors.cardnumber)}
                      />
                      {touched.cardnumber && errors.cardnumber && (
                        <FormHelperText error id="error-cardnumber">
                          {errors.cardnumber}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </StyledGrid>
                  <Grid
                    item
                    sx={{
                      paddingTop: '24px',
                      paddingLeft: '24px',
                      maxWidth: '100%',
                      flexBasis: '100%',
                      flexGrow: '0',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <FormControl
                        sx={{
                          width: '100%',
                        }}
                      >
                        <TextField
                          id="month"
                          select
                          value={values.month}
                          defaultValue={values.month}
                          name="month"
                          color="error"
                          label="Card Expiration Month"
                          size="small"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.month && errors.month)}
                        >
                          {months.map((month) => (
                            <MenuItem key={month} value={month} selected>
                              {month}
                            </MenuItem>
                          ))}
                        </TextField>
                        {touched.month && errors.month && (
                          <FormHelperText error id="error-month">
                            {errors.month}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        sx={{
                          width: '100%',
                          marginLeft: '24px',
                          marginRight: '24px',
                        }}
                      >
                        <TextField
                          id="year"
                          select
                          value={values.year}
                          defaultValue={values.year}
                          name="year"
                          label="Card Expiration Year"
                          color="error"
                          size="small"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.year && errors.year)}
                        >
                          {years().map((year) => (
                            <MenuItem key={year} value={year} selected>
                              {year}
                            </MenuItem>
                          ))}
                        </TextField>
                        {touched.year && errors.year && (
                          <FormHelperText error id="error-year">
                            {errors.year}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        sx={{
                          width: '100%',
                        }}
                      >
                        <TextField
                          id="code"
                          type="number"
                          value={values.code}
                          name="code"
                          label="CVC/CVV"
                          color="error"
                          size="small"
                          // InputLabelProps={{
                          //   shrink: true,
                          // }}
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
                      {errors.submit && (
                        <Grid item xs={12}>
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </Grid>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  variant="text"
                  color="inherit"
                  sx={{
                    marginTop: '24px',
                    textTransform: 'capitalize',
                    color: '#D32F2F',
                    fontWeight: '600',
                    lineHeight: '1',
                  }}
                  onClick={handleCoupon}
                >
                  I have a coupon
                </Button>
                {applyCoupon && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '16px',
                      marginTop: '24px',
                      maxWidth: '400px',
                    }}
                  >
                    <FormControl
                      sx={{
                        width: '100%',
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        placeholder="Enter coupon code"
                        variant="outlined"
                        color="error"
                        size="small"
                        onChange={(e) => setCouponName(e.target.value)}
                      />
                    </FormControl>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        textTransform: 'capitalize',
                      }}
                      onClick={calculateCoupon}
                      disabled={loading}
                    >
                      Apply
                    </Button>
                  </Box>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  color="error"
                  sx={{
                    marginTop: '24px',
                    textTransform: 'capitalize',
                    width: '100%',
                  }}
                >
                  Confirm Payment
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Grid>
  )
}
