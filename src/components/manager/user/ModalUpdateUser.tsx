import { Dispatch, SetStateAction, useState } from 'react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { ErrorMessage, FieldArray, Formik } from 'formik'
import * as Yup from 'yup'

import AuthenticationService from '../../../services/authentication-service'
import ErrorService from '../../../services/error-service'
import { AuthResponseType } from '../../../types/auth-response-type'
import { UpdateClaimsType } from '../../../types/update-claims-type'
import { UserType } from '../../../types/user-type'

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}))

type ModalUpdateUserProps = {
  openModalUpdateUser: boolean
  setOpenModalUpdateUser: Dispatch<SetStateAction<boolean>>
  user: UserType
  updateUserFromUsersList: (authResponse: AuthResponseType) => Promise<void>
}

export default function ModalUpdateUser({
  openModalUpdateUser,
  setOpenModalUpdateUser,
  user,
  updateUserFromUsersList,
}: ModalUpdateUserProps) {
  const { UpdateClaims } = AuthenticationService()
  const { ErrorHandler } = ErrorService()
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setOpenModalUpdateUser(false)
  }

  const updateClaims = async (values: UpdateClaimsType) => {
    setLoading(true)
    await UpdateClaims(values)
      .then((res) => {
        updateUserFromUsersList(res)
        setLoading(false)
        setOpenModalUpdateUser(false)
      })
      .catch((err) => {
        ErrorHandler(err)
        setLoading(false)
      })
  }

  return (
    <Dialog
      open={openModalUpdateUser}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'lg'}
    >
      <DialogTitle>Update User Claims</DialogTitle>
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
            <StyledPaper
              sx={{
                my: 1,
                mx: 'auto',
                p: 2,
              }}
            >
              <Grid item>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    id: user.id,
                    email: user.email,
                    claims: user.claims,
                    version: user.version,
                    submit: '',
                  }}
                  validationSchema={Yup.object().shape({
                    claims: Yup.array().of(
                      Yup.object().shape({
                        type: Yup.string().required('claims type is required'),
                        value: Yup.string().required(
                          'claims value is required'
                        ),
                      })
                    ),
                  })}
                  onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      setStatus({ success: false })
                      setSubmitting(false)
                      updateClaims(values)
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
                            <TextField
                              id="email-login"
                              type="email"
                              value={values.email}
                              name="email"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Enter email address"
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
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
                          <Stack direction="row" spacing={1}>
                            <FieldArray
                              name="claims"
                              render={(arrayClaims) => {
                                const claims = values.claims
                                return (
                                  <div>
                                    <Grid container>
                                      <Grid item xs={12}>
                                        <Button
                                          onClick={() =>
                                            arrayClaims.push({
                                              type: '',
                                              value: '',
                                            })
                                          }
                                        >
                                          New Claim
                                        </Button>
                                      </Grid>

                                      {claims?.length > 0 &&
                                        claims.map((claim, index) => (
                                          <div key={index}>
                                            <Grid container spacing={1}>
                                              <Grid item xs={1}>
                                                <Grid container spacing={1}>
                                                  <Grid item xs={12}>
                                                    <Stack
                                                      direction="column"
                                                      alignItems="center"
                                                      spacing={4}
                                                    >
                                                      <IconButton
                                                        disabled={loading}
                                                        aria-label="new"
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                          arrayClaims.push({
                                                            type: '',
                                                            value: '',
                                                          })
                                                        }
                                                      >
                                                        <AddBoxIcon fontSize="inherit" />
                                                      </IconButton>
                                                      <IconButton
                                                        disabled={loading}
                                                        aria-label="delete"
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                          arrayClaims.remove(
                                                            index
                                                          )
                                                        }
                                                      >
                                                        <DeleteIcon fontSize="inherit" />
                                                      </IconButton>
                                                    </Stack>
                                                  </Grid>
                                                </Grid>
                                              </Grid>
                                              <Grid item xs={5}>
                                                <Stack spacing={1}>
                                                  <InputLabel htmlFor="claim-type">
                                                    Type
                                                  </InputLabel>
                                                  <OutlinedInput
                                                    id="claim-type"
                                                    type="text"
                                                    value={claim.type}
                                                    name={`claims.${index}.type`}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter claim type"
                                                    fullWidth
                                                    error={Boolean(
                                                      touched.claims?.[index] &&
                                                        errors.claims?.[index]
                                                    )}
                                                  />
                                                  {touched.claims?.[index] &&
                                                    errors.claims?.[index] && (
                                                      <FormHelperText
                                                        error
                                                        id="error-claim-type"
                                                      >
                                                        <ErrorMessage
                                                          name={`claims.${index}.type`}
                                                        />
                                                      </FormHelperText>
                                                    )}
                                                </Stack>
                                              </Grid>
                                              <Grid item xs={5}>
                                                <Stack spacing={1}>
                                                  <InputLabel htmlFor="claim-value">
                                                    Value
                                                  </InputLabel>
                                                  <OutlinedInput
                                                    id="claim-value"
                                                    type="text"
                                                    value={claim.value}
                                                    name={`claims.${index}.value`}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter claim value"
                                                    fullWidth
                                                    error={Boolean(
                                                      touched.claims?.[index] &&
                                                        errors.claims?.[index]
                                                    )}
                                                  />
                                                  {touched.claims?.[index] &&
                                                    errors.claims?.[index] && (
                                                      <FormHelperText
                                                        error
                                                        id="error-claim-value"
                                                      >
                                                        <ErrorMessage
                                                          name={`claims.${index}.value`}
                                                        />
                                                      </FormHelperText>
                                                    )}
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </div>
                                        ))}
                                    </Grid>
                                  </div>
                                )
                              }}
                            />
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
                              size="small"
                              fullWidth
                              color="secondary"
                            >
                              Update Claims
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
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
