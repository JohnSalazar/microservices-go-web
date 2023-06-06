import { useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material'
import { Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as Yup from 'yup'

import { useAuth } from '@/contexts/AuthContext'
import ErrorService from '@/services/error-service'
import { SigninType } from '@/types/signin-type'

export default function AuthSignin() {
  const { signIn, signOut } = useAuth()
  const { ErrorHandler } = ErrorService()
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { returnURL } = router.query

  const urlSignin = returnURL ? `/signup?returnURL=${returnURL}` : `/signup`
  const urlForgotPassword = returnURL
    ? `/requestpassword?returnURL=${returnURL}`
    : `/requestpassword`

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  useEffect(() => {
    signOut()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signin = async (values: SigninType) => {
    setLoading(true)
    await signIn(values)
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
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        password: Yup.string().max(255).required('Password is required'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          setStatus({ success: false })
          setSubmitting(false)
          signin(values)
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
        // <form noValidate onSubmit={handleSubmit}>
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">Email Address</InputLabel>
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
                <InputLabel htmlFor="password-login">Password</InputLabel>
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
              <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                <Link href={urlForgotPassword} color="inherit">
                  Forgot Password?
                </Link>
              </Typography>
            </Grid>
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              {/* <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
              >
                Sign In
              </Button> */}
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                size="small"
                fullWidth
              >
                Sign In
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link href={urlSignin} color="inherit">
                  Sign Up
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  )
}
