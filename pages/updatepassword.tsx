import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Formik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as Yup from 'yup'

import { useAuth } from '@/contexts/AuthContext'
import ErrorService from '@/services/error-service'
import { UpdatePasswordType } from '@/types/update-password-type'

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}))

export default function UpdatePassword() {
  const { updatePassword } = useAuth()
  const router = useRouter()
  const { returnURL } = router.query

  const { ErrorHandler } = ErrorService()
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm)
  }

  const handleMouseDownPasswordConfirm = (event: any) => {
    event.preventDefault()
  }

  const updatepassword = async (values: UpdatePasswordType) => {
    setLoading(true)
    await updatePassword(values)
      .then(() => {
        returnURL ? router.push(returnURL.toString()) : router.push('/')
      })
      .catch((err) => {
        if (err.response?.data?.error[0] === 'customer not found') {
          returnURL ? router.push(returnURL.toString()) : router.push('/')
          return
        }
        ErrorHandler(err)
        setLoading(false)
      })
  }

  return (
    <>
      <Head>
        <title>MyShop - Update password</title>
        <meta name="description" content="Update password" />
        <meta property="og:title" content="MyShop - Update password" />
        <meta property="og:description" content="Update password" />
        <meta
          property="og:url"
          content="https://www.myshop.com/updatepassword"
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
        <Grid
          container
          sx={{
            maxWidth: '420px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
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
                  email: '',
                  password: '',
                  passwordConfirm: '',
                  requestUpdatePasswordCode: '',
                  submit: '',
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required'),
                  password: Yup.string()
                    .min(6)
                    .max(255)
                    .required('Password is required'),
                  passwordConfirm: Yup.string()
                    .min(6)
                    .max(255)
                    .required('Password is required')
                    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
                  requestUpdatePasswordCode: Yup.string()
                    .min(4)
                    .max(10)
                    .required('Code is required'),
                })}
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    setStatus({ success: false })
                    setSubmitting(false)
                    updatepassword(values)
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
                  handleChange,
                  handleSubmit,
                  touched,
                  values,
                }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="email-login">
                            Email Address
                          </InputLabel>
                          <OutlinedInput
                            id="email-login"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                          />
                          {touched.email && errors.email && (
                            <FormHelperText error id="error-email-login">
                              {errors.email}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="password-login">
                            Password
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            id="password-login"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                  size="large"
                                >
                                  {showPassword ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            placeholder="Enter password"
                          />
                          {touched.password && errors.password && (
                            <FormHelperText error id="error-password-login">
                              {errors.password}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="confirm-password">
                            Confirm Password
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            error={Boolean(
                              touched.passwordConfirm && errors.passwordConfirm
                            )}
                            id="confirm-password"
                            type={showPasswordConfirm ? 'text' : 'password'}
                            value={values.passwordConfirm}
                            name="passwordConfirm"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle confirm password visibility"
                                  onClick={handleClickShowPasswordConfirm}
                                  onMouseDown={handleMouseDownPasswordConfirm}
                                  edge="end"
                                  size="large"
                                >
                                  {showPasswordConfirm ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            placeholder="Enter confirm password"
                          />
                          {touched.passwordConfirm &&
                            errors.passwordConfirm && (
                              <FormHelperText error id="error-confirm-password">
                                {errors.passwordConfirm}
                              </FormHelperText>
                            )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="first-name">Code</InputLabel>
                          <OutlinedInput
                            id="requestUpdatePasswordCode"
                            type="text"
                            value={values.requestUpdatePasswordCode}
                            name="requestUpdatePasswordCode"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter confirmation code"
                            fullWidth
                            error={Boolean(
                              touched.requestUpdatePasswordCode &&
                                errors.requestUpdatePasswordCode
                            )}
                          />
                          {touched.requestUpdatePasswordCode &&
                            errors.requestUpdatePasswordCode && (
                              <FormHelperText error id="error-code">
                                {errors.requestUpdatePasswordCode}
                              </FormHelperText>
                            )}
                        </Stack>
                      </Grid>
                      {errors.submit && (
                        <Grid item xs={12}>
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          disabled={loading}
                          variant="contained"
                          fullWidth
                          size="small"
                        >
                          Confirm
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </Grid>
          </StyledPaper>
        </Grid>
      </Box>
    </>
  )
}
