import { Box, Grid, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'

import AuthLogin from '@/components/signin/AuthSignin'

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}))

export default function Signin() {
  return (
    <>
      <Head>
        <title>MyShop - Signin</title>
        <meta name="description" content="Signin" />
        <meta property="og:title" content="MyShop - Signin" />
        <meta property="og:description" content="Signin" />
        <meta property="og:url" content="https://www.myshop.com/signin" />
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
              <AuthLogin />
            </Grid>
          </StyledPaper>
        </Grid>
      </Box>
    </>
  )
}
