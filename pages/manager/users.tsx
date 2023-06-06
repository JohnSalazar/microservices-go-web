import { useEffect, useState } from 'react'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TreeItem } from '@mui/lab'
import TreeView from '@mui/lab/TreeView'
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
import ModalAddUser from '@/components/manager/user/ModalAddUser'
import ModalUpdateUser from '@/components/manager/user/ModalUpdateUser'
import { initialUserType, useAuth } from '@/contexts/AuthContext'
import { useSearch } from '@/contexts/SearchContext'
import AuthenticationService from '@/services/authentication-service'
import ErrorService from '@/services/error-service'
import TokenService from '@/services/token-service'
import { AuthResponseType } from '@/types/auth-response-type'
import { UserType } from '@/types/user-type'

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

export default function Users() {
  const { user: adminUser, replaceCredentials } = useAuth()
  const { ValidateClaims } = TokenService()
  const { GetUsers } = AuthenticationService()
  const { ErrorHandler } = ErrorService()
  const { word, setLoading } = useSearch()
  const [users, setUsers] = useState<UserType[]>([])
  const [user, setUser] = useState<UserType>(initialUserType)
  const [openModalAddUser, setOpenModalAddUser] = useState(false)
  const [openModalUpdateUser, setOpenModalUpdateUser] = useState(false)

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

  const handleOpenModalAddUser = () => {
    setOpenModalAddUser(true)
  }

  const handleOpenModalUpdateUser = (user: UserType) => {
    setUser(user)
    setOpenModalUpdateUser(true)
  }

  const updateUserFromUsersList = async (authResponse: AuthResponseType) => {
    const userIndex = users.findIndex(
      (users) => users.id == authResponse.user.id
    )
    users[userIndex] = authResponse.user
    setUsers(users)
    if (authResponse.user.id === adminUser?.id)
      await replaceCredentials(authResponse)
  }

  const fetchUsers = async () => {
    const response = await GetUsers(word, page, rowsPerPage)
    return response.response
  }

  useEffect(() => {
    setPage(1)
  }, [word])

  useEffect(() => {
    fetchUsers()
      .then((res) => setUsers(res))
      .catch((err) => ErrorHandler(err))

    setLoading(false)
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
                  Users
                </Typography>

                {adminUser?.claims &&
                  ValidateClaims(adminUser.claims, 'admin', 'create') && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleOpenModalAddUser}
                      aria-label="add user"
                    >
                      Add User
                    </Button>
                  )}
              </Box>
              <TableContainer sx={{ maxHeight: 680 }} component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell align="center">Claims</StyledTableCell>
                      <StyledTableCell align="center"></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.map((user) => (
                      <StyledTableRow key={user.id}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          width={'50%'}
                        >
                          {user.email}
                        </StyledTableCell>
                        <StyledTableCell width={'15%'}>
                          {user.claims && (
                            <TreeView
                              aria-label="file system navigator"
                              defaultCollapseIcon={<ExpandMoreIcon />}
                              defaultExpandIcon={<ChevronRightIcon />}
                              sx={{
                                maxHeight: 240,
                                flexGrow: 1,
                                maxWidth: 400,
                                overflowY: 'auto',
                              }}
                            >
                              <TreeItem nodeId="claims" label="Claims">
                                {user.claims.map((claims) => (
                                  <TreeItem
                                    key={claims.type}
                                    nodeId={claims.type}
                                    label={claims.type}
                                  >
                                    <TreeItem
                                      key={claims.value}
                                      nodeId={claims.value}
                                      label={claims.value}
                                    />
                                  </TreeItem>
                                ))}
                              </TreeItem>
                            </TreeView>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center" width={'10%'}>
                          {adminUser?.claims && (
                            <Stack
                              direction="row"
                              spacing={0.3}
                              alignItems={'center'}
                              justifyContent={'center'}
                            >
                              {ValidateClaims(
                                adminUser.claims,
                                'admin',
                                'create'
                              ) && (
                                <IconButton
                                  onClick={handleOpenModalAddUser}
                                  aria-label="create"
                                >
                                  <AddBoxOutlinedIcon />
                                </IconButton>
                              )}
                              {ValidateClaims(
                                adminUser.claims,
                                'admin',
                                'update'
                              ) && (
                                <IconButton
                                  onClick={() =>
                                    handleOpenModalUpdateUser(user)
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
                  page * rowsPerPage + (users?.length == rowsPerPage ? 1 : 0)
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
      <ModalAddUser
        openModalAddUser={openModalAddUser}
        setOpenModalAddUser={setOpenModalAddUser}
        setUsers={setUsers}
        users={users}
      />
      <ModalUpdateUser
        openModalUpdateUser={openModalUpdateUser}
        setOpenModalUpdateUser={setOpenModalUpdateUser}
        user={user}
        updateUserFromUsersList={updateUserFromUsersList}
      />
    </Box>
  )
}
