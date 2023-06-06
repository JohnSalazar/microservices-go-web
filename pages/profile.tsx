import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
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

import ImagePreview from '@/components/ImagePreview'
import { useApi } from '@/contexts/ApiContext'
import { useAuth } from '@/contexts/AuthContext'
import ErrorService from '@/services/error-service'

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}))

export default function Profile() {
  const { customer, setCustomer } = useAuth()
  const { customerService } = useApi()
  const { AddCustomer, UpdateCustomer } = customerService
  const router = useRouter()
  const { ErrorHandler } = ErrorService()

  const [saveAvatarImage, setSaveAvatarImage] = useState(false)
  const [urlImage, setUrlImage] = useState<string | null>(null)
  // const config = ConfigService()

  const saveProfile = async (values: any) => {
    if (!customer) {
      await AddCustomer(values)
        .then((res) => {
          setCustomer(res)
          setSaveAvatarImage(true)
        })
        .catch((err) => {
          ErrorHandler(err)
        })
    } else {
      await UpdateCustomer(values)
        .then((res) => {
          setCustomer(res)
          setSaveAvatarImage(true)
        })
        .catch((err) => {
          ErrorHandler(err)
        })
    }
    // router.push('/')
  }

  const goToHome = () => {
    router.push('/')
  }

  useEffect(() => {
    if (urlImage) {
      customer.avatar = urlImage
      UpdateCustomer(customer)
        .then((response) => {
          setCustomer(response)
          router.push('/')
        })
        .catch((err) => ErrorHandler(err))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlImage])

  return (
    <>
      <Head>
        <title>MyShop - Profile</title>
        <meta name="description" content="My profile" />
        <meta property="og:title" content="MyShop - Profile" />
        <meta property="og:description" content="My profile" />
        <meta property="og:url" content="https://www.myshop.com/profile" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
        <Grid
          container
          sx={{
            maxWidth: '720px',
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
            <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 6 }}>
              <Typography variant="h3">Profile</Typography>
            </Box>

            <ImagePreview
              title="Avatar Image"
              description="Select an image for your avatar"
              // folderName={config.folderNameAvatarImage}
              saveImage={saveAvatarImage}
              setSaveImage={setSaveAvatarImage}
              urlImage={customer?.avatar ? customer.avatar : null}
              setUrlImage={setUrlImage}
              // imageId={customer?.id}
              // extension="png"
            />
            <Grid item>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  id: customer?.id ?? '',
                  email: customer?.email ?? '',
                  firstname: customer?.firstname ?? '',
                  lastname: customer?.lastname ?? '',
                  phone: customer?.phone ?? '',
                  version: customer?.version ?? 0,
                  submit: '',
                }}
                validationSchema={Yup.object().shape({
                  firstname: Yup.string()
                    .max(255)
                    .required('First name is required'),
                  lastname: Yup.string()
                    .max(255)
                    .required('Last name is required'),
                  phone: Yup.string().min(8).max(20),
                })}
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    setStatus({ success: false })
                    setSubmitting(false)
                    saveProfile(values)
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
                      <Grid item xs={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="email">Email</InputLabel>
                          <OutlinedInput
                            id="email"
                            type="text"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                          />
                          {touched.email && errors.email && (
                            <FormHelperText error id="error-email">
                              {errors.email}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="phone">Phone</InputLabel>
                          <OutlinedInput
                            id="phone"
                            type="text"
                            value={values.phone}
                            name="phone"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            fullWidth
                            error={Boolean(touched.phone && errors.phone)}
                          />
                          {touched.phone && errors.phone && (
                            <FormHelperText error id="error-phone">
                              {errors.phone}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      {errors.submit && (
                        <Grid item xs={12}>
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </Grid>
                      )}
                      <Grid item xs={4}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="small"
                          color="secondary"
                        >
                          Save Profile
                        </Button>
                      </Grid>
                      <Grid item xs={4}></Grid>
                      <Grid item xs={4}>
                        <Button
                          type="button"
                          variant="contained"
                          fullWidth
                          size="small"
                          onClick={goToHome}
                        >
                          Back to Home
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
