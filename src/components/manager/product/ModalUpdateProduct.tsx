import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Formik } from 'formik'
import * as Yup from 'yup'

import ImagePreview from '@/components/ImagePreview'
import { useApi } from '@/contexts/ApiContext'
import ErrorService from '@/services/error-service'
import { ProductType } from '@/types/product-type'
import convertToSlug from '@/utils/slug'

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

type ModalUpdateProductProps = {
  openModalUpdateProduct: boolean
  setOpenModalUpdateProduct: Dispatch<SetStateAction<boolean>>
  product: ProductType
  updateProductFromProductsList: (product: ProductType) => Promise<void>
}

export default function ModalUpdateProduct({
  openModalUpdateProduct,
  setOpenModalUpdateProduct,
  product,
  updateProductFromProductsList,
}: ModalUpdateProductProps) {
  const { productService } = useApi()
  const { UpdateProduct } = productService
  const { ErrorHandler } = ErrorService()
  const [loading, setLoading] = useState(false)
  const [saveProductImage, setSaveProductImage] = useState(false)
  const [urlImage, setUrlImage] = useState<string | null>(null)
  // const config = ConfigService()

  const handleClose = () => {
    setOpenModalUpdateProduct(false)
  }

  const Update = async (values: ProductType) => {
    setLoading(true)
    setSaveProductImage(false)
    await UpdateProduct(values)
      .then((res) => {
        updateProductFromProductsList(res)
        setLoading(false)
        setSaveProductImage(true)
      })
      .catch((err) => {
        ErrorHandler(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (urlImage) {
      product.image = urlImage
      UpdateProduct(product)
        .then((response) => {
          updateProductFromProductsList(response)
        })
        .catch((err) => ErrorHandler(err))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlImage])

  return (
    <Dialog
      open={openModalUpdateProduct}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'lg'}
    >
      <DialogTitle>Update Product</DialogTitle>
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
                    enableReinitialize={true}
                    initialValues={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      description: product.description,
                      price: product.price,
                      quantity: product.quantity,
                      image: product.image,
                      version: product.version,
                      submit: '',
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string().max(500).required('name is required'),
                      slug: Yup.string().max(600).required('slug is required'),
                      description: Yup.string().max(10000),
                      price: Yup.number()
                        .min(1)
                        .required('price is required')
                        .positive(),
                    })}
                    onSubmit={async (
                      values,
                      { setErrors, setStatus, setSubmitting }
                    ) => {
                      try {
                        setStatus({ success: false })
                        setSubmitting(false)
                        Update(values)
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
                                onChange={(e) => {
                                  handleChange(e)
                                  values.slug = e.target.value
                                    ? convertToSlug(e.target.value)
                                    : ''
                                }}
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
                            <Stack spacing={1}>
                              <InputLabel htmlFor="slug">Slug</InputLabel>
                              <OutlinedInput
                                id="slug"
                                type="text"
                                value={values.slug}
                                name="slug"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter slug"
                                fullWidth
                                error={Boolean(touched.slug && errors.slug)}
                              />
                              {touched.slug && errors.slug && (
                                <FormHelperText error id="error-slug">
                                  {errors.slug}
                                </FormHelperText>
                              )}
                            </Stack>
                          </Grid>
                          <Grid item xs={12}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="description">
                                Description
                              </InputLabel>
                              <OutlinedInput
                                id="description"
                                type="text"
                                multiline={true}
                                minRows={3}
                                value={values.description}
                                name="description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter description"
                                fullWidth
                                error={Boolean(
                                  touched.description && errors.description
                                )}
                              />
                              {touched.description && errors.description && (
                                <FormHelperText error id="error-description">
                                  {errors.description}
                                </FormHelperText>
                              )}
                            </Stack>
                          </Grid>
                          <Grid item xs={6} sm={5}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="price">Price</InputLabel>
                              <OutlinedInput
                                id="price"
                                type="number"
                                value={values.price}
                                name="price"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter price"
                                fullWidth
                                startAdornment={
                                  <InputAdornment position="start">
                                    {values.price
                                      ? values.price.getCurrencySymbol()
                                      : '$'}
                                  </InputAdornment>
                                }
                                error={Boolean(touched.price && errors.price)}
                              />
                              {touched.price && errors.price && (
                                <FormHelperText error id="error-price">
                                  {errors.price}
                                </FormHelperText>
                              )}
                            </Stack>
                          </Grid>
                          <Grid item xs={9}></Grid>

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
                                Update Product
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
              <StyledPaper
                sx={{
                  my: 1,
                  mx: 'auto',
                  p: 2,
                }}
              >
                <ImagePreview
                  title="Product Image"
                  description="Select an image for the product"
                  // folderName={config.folderNameProductImage}
                  saveImage={saveProductImage}
                  setSaveImage={setSaveProductImage}
                  urlImage={product?.image ? product.image : null}
                  setUrlImage={setUrlImage}
                  // imageId={product.id}
                  setKeepWindowOpen={setOpenModalUpdateProduct}
                />
              </StyledPaper>
            </StyledStack>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
