import { useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { AppBar, Box, InputBase, Toolbar, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/system'
import Link from 'next/link'

import ModalSignin from '@/components/signin/ModalSignin'
import User from '@/components/User'
import { useAuth } from '@/contexts/AuthContext'
import { useSearch } from '@/contexts/SearchContext'

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'primary',
})

const Search = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '50%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '50%',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  color: [theme.palette.text.secondary],
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: [theme.palette.text.secondary],
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '96ch',
      '&:focus': {
        width: '96ch',
      },
    },
  },
}))

export const HeaderManager = () => {
  const { search, loading, setLoading } = useSearch()
  const { setIsManager } = useAuth()

  const handleSearch = (e: { target: { value: string } }) => {
    setLoading(true)
    setTimeout(() => {
      search(e.target.value)
    }, 1000)
  }

  useEffect(() => {
    search('')
    setIsManager(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <AppBar sx={{ position: 'fixed', boxShadow: 'none' }}>
        <StyledToolbar>
          <Link href={`/manager`} color="inherit">
            <Typography
              variant="h6"
              sx={{ display: { xs: 'none', sm: 'block', cursor: 'pointer' } }}
            >
              MY SHOP
            </Typography>
          </Link>
          <Search>
            <SearchIconWrapper>
              {loading ? <CircularProgress size={20} /> : <SearchIcon />}
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearch}
            />
          </Search>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <User />
          </Box>
        </StyledToolbar>
      </AppBar>
      <ModalSignin />
    </>
  )
}
