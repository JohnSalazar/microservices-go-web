import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import Link from 'next/link'

export default function Manager() {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      marginTop={'40vh'}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 4 }}
      >
        <Link href={'/manager/products'} color="inherit">
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="200"
                image="/market-place.png"
                alt="products"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registration and updating of products for the marketplace
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
        <Link href={'/manager/coupons'} color="inherit">
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="200"
                image="/coupon.png"
                alt="coupons"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Coupons
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Register, update and activate discount coupons on the
                  marketplace
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
        <Link href={'/manager/users'} color="inherit">
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="200"
                image="/users.png"
                alt="users"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  System Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Register new users, change access permissions
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </Stack>
    </Grid>
  )
}
