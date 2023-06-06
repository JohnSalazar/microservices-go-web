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

type ModalAddProductProps = {
  openModalAddProduct: boolean
  setOpenModalAddProduct: Dispatch<SetStateAction<boolean>>
  setProducts: Dispatch<SetStateAction<ProductType[]>>
  products: ProductType[]
  updateProductFromProductsList: (product: ProductType) => Promise<void>
}

export default function ModalAddProduct({
  openModalAddProduct,
  setOpenModalAddProduct,
  setProducts,
  products,
  updateProductFromProductsList,
}: ModalAddProductProps) {
  const { productService } = useApi()
  const { AddProduct, UpdateProduct } = productService
  const { ErrorHandler } = ErrorService()
  const [loading, setLoading] = useState(false)
  const [saveProductImage, setSaveProductImage] = useState(false)
  // const [productId, setProductId] = useState<string | undefined>()
  const [product, setProduct] = useState<ProductType>(null)
  const [urlImage, setUrlImage] = useState<string | null>(null)
  // const config = ConfigService()

  const handleClose = () => {
    setOpenModalAddProduct(false)
  }

  const add = async (values: ProductType) => {
    setLoading(true)
    await AddProduct(values)
      .then((res) => {
        // setProductId(res.id)
        setProduct(res)
        if (products) {
          setProducts((product) => [...product, res])
        } else {
          setProducts([res])
        }
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
      open={openModalAddProduct}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'lg'}
    >
      <DialogTitle>Add Product</DialogTitle>
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
                      name: '',
                      slug: '',
                      description: '',
                      price: 1,
                      quantity: 1,
                      version: 0,
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
                          <Grid item xs={6} sm={3}>
                            <Stack spacing={1}>
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
                            </Stack>
                          </Grid>
                          <Grid item sx={{ xs: { visibility: 'false' } }} />

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
                                Add Product
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
                  // imageId={productId}
                  setKeepWindowOpen={setOpenModalAddProduct}
                />
              </StyledPaper>
            </StyledStack>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
