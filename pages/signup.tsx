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
  Link,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Formik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as Yup from 'yup'

import { useAuth } from '@/contexts/AuthContext'
import ErrorService from '@/services/error-service'
import { SignupType } from '@/types/signup-type'

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}))

export default function Signup() {
  const { signUp } = useAuth()
  const router = useRouter()
  const { returnURL } = router.query

  const urlSignin = returnURL ? `/signin?returnURL=${returnURL}` : `/signin`

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

  const signup = async (values: SignupType) => {
    setLoading(true)
    await signUp(values)
      .then(() => {
        returnURL ? router.push(returnURL.toString()) : router.push('/')
      })
      .catch((err) => {
        ErrorHandler(err)
        setLoading(false)
      })
  }
  return (
    <>
      <Head>
        <title>MyShop - Signup</title>
        <meta name="description" content="Signup" />
        <meta property="og:title" content="MyShop - Signup" />
        <meta property="og:description" content="Signup" />
        <meta property="og:url" content="https://www.myshop.com/signup" />
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
                  firstname: '',
                  lastname: '',
                  email: '',
                  password: '',
                  passwordConfirm: '',
                  submit: '',
                }}
                validationSchema={Yup.object().shape({
                  firstname: Yup.string()
                    .max(255)
                    .required('First name is required'),
                  lastname: Yup.string()
                    .max(255)
                    .required('Last name is required'),
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
                })}
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    setStatus({ success: false })
                    setSubmitting(false)
                    signup(values)
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
                      <Grid item xs={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="first-name">
                            First Name
                          </InputLabel>
                          <OutlinedInput
                            id="first-name"
                            type="text"
                            value={values.firstname}
                            name="firstname"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            fullWidth
                            error={Boolean(
                              touched.firstname && errors.firstname
                            )}
                          />
                          {touched.firstname && errors.firstname && (
                            <FormHelperText error id="error-first-name">
                              {errors.firstname}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="last-name">Last Name</InputLabel>
                          <OutlinedInput
                            id="last-name"
                            type="text"
                            value={values.lastname}
                            name="lastname"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            fullWidth
                            error={Boolean(touched.lastname && errors.lastname)}
                          />
                          {touched.lastname && errors.lastname && (
                            <FormHelperText error id="error-last-name">
                              {errors.lastname}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
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
                          size="small"
                          fullWidth
                        >
                          Register Account
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{ mt: 3 }}
                        >
                          Already have an account?{' '}
                          <Link href={urlSignin} color="inherit">
                            Sign In
                          </Link>
                        </Typography>
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
