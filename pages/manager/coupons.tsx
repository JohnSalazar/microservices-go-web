import { useEffect, useState } from 'react'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import {
  Box,
  Button,
  Chip,
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

import ModalAddCoupon from '@/components/manager/coupon/ModalAddCoupon'
import ModalUpdateCoupon from '@/components/manager/coupon/ModalUpdateCoupon'
import LayoutManager from '@/components/manager/LayoutManager'
import { useApi } from '@/contexts/ApiContext'
import { useAuth } from '@/contexts/AuthContext'
import { useSearch } from '@/contexts/SearchContext'
import ErrorService from '@/services/error-service'
import TokenService from '@/services/token-service'
import { CouponType } from '@/types/coupon-type'

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

const initialCouponType: CouponType = {
  id: '',
  name: '',
  value: 1,
  isPercentage: false,
  quantity: 1,
  active: true,
  version: 0,
}

export default function Coupons() {
  const { user } = useAuth()
  const { couponService } = useApi()
  const { ValidateClaims } = TokenService()
  const { GetCoupons } = couponService
  const { ErrorHandler } = ErrorService()
  const { word, setLoading } = useSearch()
  const [coupons, setCoupons] = useState<CouponType[]>([])
  const [coupon, setCoupon] = useState<CouponType>(initialCouponType)
  const [openModalAddCoupon, setOpenModalAddCoupon] = useState(false)
  const [openModalUpdateCoupon, setOpenModalUpdateCoupon] = useState(false)

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

  const handleOpenModalAddCoupon = () => {
    setOpenModalAddCoupon(true)
  }

  const handleOpenModalUpdateCoupon = (coupon: CouponType) => {
    setCoupon(coupon)
    setOpenModalUpdateCoupon(true)
  }

  const updateCouponFromCouponsList = async (coupon: CouponType) => {
    const couponIndex = coupons.findIndex((coupons) => coupons.id == coupon.id)
    coupons[couponIndex] = coupon
    setCoupons(coupons)
  }

  const fetchCoupons = async () => {
    const response = await GetCoupons(word, page, rowsPerPage)
    return response.response
  }

  useEffect(() => {
    setPage(1)
  }, [word])

  useEffect(() => {
    fetchCoupons()
      .then((res) => {
        setLoading(false)
        setCoupons(res)
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
                  Coupons
                </Typography>
                {user?.claims &&
                  ValidateClaims(user.claims, 'coupon', 'create') && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleOpenModalAddCoupon}
                      aria-label="add coupon"
                    >
                      Add Coupon
                    </Button>
                  )}
              </Box>
              <TableContainer sx={{ maxHeight: 680 }} component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell align="right">Value</StyledTableCell>
                      <StyledTableCell align="center">Type</StyledTableCell>
                      <StyledTableCell align="center">Quantity</StyledTableCell>
                      <StyledTableCell align="center">Active</StyledTableCell>
                      <StyledTableCell align="center"></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coupons?.map((coupon) => (
                      <StyledTableRow key={coupon.id}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          width={'50%'}
                        >
                          {coupon.name}
                        </StyledTableCell>
                        <StyledTableCell align="right" width={'15%'}>
                          {coupon.isPercentage
                            ? `${coupon.value}%`
                            : coupon.value.toCurrency()}
                        </StyledTableCell>
                        <StyledTableCell align="center" width={'15%'}>
                          <Chip
                            label={coupon.isPercentage ? 'percentage' : 'value'}
                            color="primary"
                            variant="outlined"
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center" width={'15%'}>
                          {coupon.quantity}
                        </StyledTableCell>
                        <StyledTableCell align="center" width={'15%'}>
                          <Chip
                            label={coupon.active ? 'active' : 'inactive'}
                            color="primary"
                            variant="outlined"
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center" width={'15%'}>
                          {user?.claims && (
                            <Stack
                              direction="row"
                              spacing={0.3}
                              alignItems={'center'}
                              justifyContent={'center'}
                            >
                              {ValidateClaims(
                                user.claims,
                                'coupon',
                                'create'
                              ) && (
                                <IconButton
                                  onClick={handleOpenModalAddCoupon}
                                  aria-label="add coupon"
                                >
                                  <AddBoxOutlinedIcon />
                                </IconButton>
                              )}
                              {ValidateClaims(
                                user.claims,
                                'coupon',
                                'update'
                              ) && (
                                <IconButton
                                  onClick={() =>
                                    handleOpenModalUpdateCoupon(coupon)
                                  }
                                  aria-label="edit product"
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
                  page * rowsPerPage + (coupons?.length == rowsPerPage ? 1 : 0)
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
      <ModalAddCoupon
        openModalAddCoupon={openModalAddCoupon}
        setOpenModalAddCoupon={setOpenModalAddCoupon}
        setCoupons={setCoupons}
        coupons={coupons}
      />
      <ModalUpdateCoupon
        openModalUpdateCoupon={openModalUpdateCoupon}
        setOpenModalUpdateCoupon={setOpenModalUpdateCoupon}
        coupon={coupon}
        updateCouponFromCouponsList={updateCouponFromCouponsList}
      />
    </Box>
  )
}
