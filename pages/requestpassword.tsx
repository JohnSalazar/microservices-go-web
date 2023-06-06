import { useState } from 'react'
import {
  Box,
  Button,
  FormHelperText,
  Grid,
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
import NotificationService from '@/services/notification-service'

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}))

export default function RequestPassword() {
  const router = useRouter()
  const { returnURL } = router.query

  const urlUpdatePassword = returnURL
    ? `/updatepassword?returnURL=${returnURL}`
    : `/updatepassword`

  const { requestUpdatePassword } = useAuth()
  const { ErrorHandler } = ErrorService()
  const { RequestPasswordUpdate: notify } = NotificationService()
  const [loading, setLoading] = useState(false)

  const requestPassword = async (email: string) => {
    setLoading(true)
    await requestUpdatePassword(email)
      .then(() => {
        notify()
        setTimeout(() => {
          router.push(urlUpdatePassword)
        }, 3000)
      })
      .catch((err) => {
        ErrorHandler(err)
        setLoading(false)
      })
  }
  return (
    <>
      <Head>
        <title>MyShop - Request password</title>
        <meta name="description" content="Request password" />
        <meta property="og:title" content="MyShop - Request password" />
        <meta property="og:description" content="Request password" />
        <meta
          property="og:url"
          content="https://www.myshop.com/requestpassword"
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
                  submit: '',
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required'),
                })}
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    setStatus({ success: false })
                    setSubmitting(false)
                    requestPassword(values.email)
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
