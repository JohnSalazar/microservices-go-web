import { useEffect, useState } from 'react'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'

import LayoutManager from '@/components/manager/LayoutManager'
import ModalAddProduct from '@/components/manager/product/ModalAddProduct'
import ModalUpdateProduct from '@/components/manager/product/ModalUpdateProduct'
import { initialProductType } from '@/components/product/Product'
import ProductImage from '@/components/product/ProductImage'
import { useApi } from '@/contexts/ApiContext'
import { useAuth } from '@/contexts/AuthContext'
import { useSearch } from '@/contexts/SearchContext'
import ErrorService from '@/services/error-service'
import TokenService from '@/services/token-service'
import { ProductType } from '@/types/product-type'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function Products() {
  const { user } = useAuth()
  const { productService } = useApi()
  const [imageLoaded, setImageLoaded] = useState<string[]>([])

  const { ValidateClaims } = TokenService()
  const { GetProducts } = productService
  const { ErrorHandler } = ErrorService()
  const { word, setLoading } = useSearch()
  const [products, setProducts] = useState<ProductType[]>([])
  const [product, setProduct] = useState<ProductType>(initialProductType)
  const [openModalAddProduct, setOpenModalAddProduct] = useState(false)
  const [openModalUpdateProduct, setOpenModalUpdateProduct] = useState(false)

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(1)
  }

  const handleOpenModalAddProduct = () => {
    setOpenModalAddProduct(true)
  }

  const handleOpenModalUpdateProduct = (product: ProductType) => {
    setProduct(product)
    setOpenModalUpdateProduct(true)
  }

  const updateProductFromProductsList = async (product: ProductType) => {
    const productIndex = products.findIndex(
      (products) => products.id == product.id
    )
    products.splice(productIndex, 1, product)
    setProducts(products)
    setProduct(product)
  }

  const fetchProducts = async () => {
    const response = await GetProducts(word, page, rowsPerPage)
    return response.response
  }

  useEffect(() => {
    setPage(1)
  }, [word])

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        setLoading(false)
        setProducts(res)
        // setDefaultProductImage(false)
      })
      .catch((err) => {
        setLoading(false)
        ErrorHandler(err)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, page, rowsPerPage])

  return (
    <Box>
      <LayoutManager>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          marginTop={10}
          marginLeft={2}
          marginRight={2}
          marginBottom={6}
          width={'93vw'}
        >
          <Box
            sx={{
              // height: '830px',
              minHeight: '10em',
              display: 'flex',
              verticalAlign: 'middle',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              // padding: '10px',
              width: '97vw',
            }}
          >
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 10px 0 10px',
                }}
              >
                <Typography variant="h2" component="h3">
                  Products
                </Typography>
                {user?.claims &&
                  ValidateClaims(user.claims, 'product', 'create') && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleOpenModalAddProduct}
                      aria-label="add product"
                    >
                      Add Product
                    </Button>
                  )}
              </Box>
              <TableContainer sx={{ maxHeight: 680 }} component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell align="center">Image</StyledTableCell>
                      <StyledTableCell align="right">Price</StyledTableCell>
                      <StyledTableCell align="center"></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products?.map((product) => (
                      <StyledTableRow key={product.id}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          width={'50%'}
                        >
                          {product.name}
                        </StyledTableCell>
                        <StyledTableCell align="center" width={'20%'}>
                          <Box
                            sx={(theme) => ({
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              [theme.breakpoints.up('sm')]: {
                                marginLeft: '16px',
                                marginRight: '16px',
                              },
                            })}
                          >
                            <ProductImage
                              product={product}
                              imageLoaded={imageLoaded}
                              setImageLoaded={setImageLoaded}
                              model={2}
                            />
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="right" width={'15%'}>
                          {product.price.toCurrency()}
                          {/* {product.price.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            // currency: 'BRL',
                          })} */}
                        </StyledTableCell>
                        <StyledTableCell align="center" width={'10%'}>
                          {user?.claims && (
                            <Stack
                              direction="row"
                              spacing={0.3}
                              alignItems={'center'}
                              justifyContent={'center'}
                            >
                              {ValidateClaims(
                                user.claims,
                                'product',
                                'create'
                              ) && (
                                <IconButton
                                  onClick={handleOpenModalAddProduct}
                                  aria-label="create"
                                >
                                  <AddBoxOutlinedIcon />
                                </IconButton>
                              )}
                              {ValidateClaims(
                                user.claims,
                                'product',
                                'update'
                              ) && (
                                <IconButton
                                  onClick={() =>
                                    handleOpenModalUpdateProduct(product)
                                  }
                                  aria-label="edit"
                                >
                                  <DriveFileRenameOutlineOutlinedIcon />
                                </IconButton>
                              )}
                            </Stack>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={
                  page * rowsPerPage + (products?.length == rowsPerPage ? 1 : 0)
                }
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </Grid>
      </LayoutManager>
      <ModalAddProduct
        openModalAddProduct={openModalAddProduct}
        setOpenModalAddProduct={setOpenModalAddProduct}
        setProducts={setProducts}
        products={products}
        updateProductFromProductsList={updateProductFromProductsList}
      />
      <ModalUpdateProduct
        openModalUpdateProduct={openModalUpdateProduct}
        setOpenModalUpdateProduct={setOpenModalUpdateProduct}
        product={product}
        updateProductFromProductsList={updateProductFromProductsList}
      />
    </Box>
  )
}
