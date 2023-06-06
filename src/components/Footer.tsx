import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'

const FooterStyled = styled(Box)({
  bottom: 0,
  position: 'relative',
  width: '100%',
})

const Title = styled(Typography)({
  fontSize: '16px',
  fontWeight: 700,
  width: 'auto',
  marginTop: '10px',
  marginBottom: '10px',
})

const Description = styled(Typography)({
  fontSize: '14px',
  width: 'auto',
  marginBottom: '5px',
})

function Footer() {
  return (
    <FooterStyled sx={{ backgroundColor: 'background.dark' }}>
      <Stack
        direction="row"
        justifyContent="space-evenly"
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box>
          <Title>Get to Know Us</Title>
          <Description>Corporate Information</Description>
          <Description>Careers</Description>
          <Description>Press Releases</Description>
          <Description>Community</Description>
          <Description>Accessibility</Description>
        </Box>
        <Box>
          <Title>Make Money with Us</Title>
          <Description>Self-Publish with Us</Description>
          <Description>Become an Affiliate</Description>
          <Description>Sell on MyShop</Description>
          <Description>Advertise Your Products</Description>
        </Box>
        <Box>
          <Title>Payment</Title>
          <Description>Credit Card</Description>
          <Description>Debit Card</Description>
        </Box>
        <Box>
          <Title>Let Us Help You</Title>
          <Description>Your Account</Description>
          <Description>Shipping Rates & Policies</Description>
          <Description>Returns & Replacements</Description>
          <Description>Manage Your Content and Devices</Description>
          <Description>Help</Description>
        </Box>
      </Stack>
      <Box sx={{ backgroundColor: 'background.dark', textAlign: 'center' }}>
        <Typography>© {new Date().getFullYear()} MyShop.com, Inc.</Typography>
      </Box>
    </FooterStyled>
  )
}

export default Footer
