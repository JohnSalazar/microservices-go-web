import { useEffect, useState } from 'react'
import { TreeItem, TreeView } from '@mui/lab'
import {
  Box,
  Button,
  Grid,
  Paper,
  SvgIcon,
  SvgIconProps,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'

import ImagePreview from '@/components/ImagePreview'
import { useApi } from '@/contexts/ApiContext'
import { useAuth } from '@/contexts/AuthContext'
import ErrorService from '@/services/error-service'
import { ClaimsType } from '@/types/claims-type'
import { CustomerType } from '@/types/customer-type'

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  // height: '95vh',
  // width: '100vw',
}))

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  )
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  )
}

export default function ProfileManager() {
  const { user, customer, setCustomer } = useAuth()
  const { customerService } = useApi()
  const { AddCustomer, UpdateCustomer } = customerService
  const { ErrorHandler } = ErrorService()

  const router = useRouter()
  const { returnURL } = router.query

  const urlReturn = returnURL ? returnURL.toString() : '/'

  const [saveAvatarImage, setSaveAvatarImage] = useState(false)
  const [urlImage, setUrlImage] = useState<string | null>(null)
  // const config = ConfigService()

  const saveProfile = async () => {
    if (!customer) {
      const newCustomer: CustomerType = {
        email: user.email,
        version: 0,
      }
      await AddCustomer(newCustomer)
        .then((res) => {
          setCustomer(res)
          setSaveAvatarImage(true)
        })
        .catch((err) => {
          ErrorHandler(err)
        })
    } else {
      setSaveAvatarImage(true)
    }
  }

  useEffect(() => {
    if (urlImage) {
      customer.avatar = urlImage
      UpdateCustomer(customer)
        .then((response) => {
          setCustomer(response)
        })
        .catch((err) => ErrorHandler(err))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlImage])

  const renderTree = (claims?: ClaimsType[]) => (
    <TreeItem
      key="claims"
      nodeId="claims"
      label="claims"
      // sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {Array.isArray(claims) &&
        claims.map((claim) => (
          <TreeView
            key={claim.type}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpanded={[claim.type]}
            defaultExpandIcon={<PlusSquare />}
          >
            <TreeItem
              key={claim.type}
              nodeId={claim.type}
              label={`type: ${claim.type}`}
            >
              <TreeItem
                key={claim.value}
                nodeId={claim.value}
                label={`value: ${claim.value}`}
              ></TreeItem>
            </TreeItem>
          </TreeView>
        ))}
    </TreeItem>
  )

  return (
    <>
      {user && (
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h2" component="h3">
                  Profile
                </Typography>
                <Link href={urlReturn}>
                  <Button variant="contained" size="small">
                    Back
                  </Button>
                </Link>
              </Box>
              <StyledPaper
                sx={{
                  my: 1,
                  mx: 'auto',
                  p: 2,
                }}
              >
                <ImagePreview
                  title="Avatar Image"
                  description="Select an image for your avatar"
                  // folderName={config.folderNameAvatarImage}
                  saveImage={saveAvatarImage}
                  setSaveImage={setSaveAvatarImage}
                  urlImage={customer?.avatar ? customer.avatar : null}
                  setUrlImage={setUrlImage}
                  // imageId={user.id}
                  // extension="png"
                />
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    color="success"
                    onClick={saveProfile}
                    // onClick={() => setSaveAvatarImage(true)}
                  >
                    Update Avatar
                  </Button>
                </Grid>
              </StyledPaper>
              <Box paddingBottom={4}>
                <TextField
                  id="email"
                  label="Email Sign In"
                  defaultValue={user?.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  color="info"
                  fullWidth
                  focused
                />
              </Box>
              <Box>
                <TreeView
                  aria-label="rich object"
                  defaultCollapseIcon={<MinusSquare />}
                  defaultExpanded={['claims']}
                  defaultExpandIcon={<PlusSquare />}
                  sx={{
                    height: '60vh',
                    flexGrow: 1,
                    maxWidth: 400,
                    overflowY: 'auto',
                    // color: 'navy',
                  }}
                >
                  {renderTree(user?.claims)}
                </TreeView>
              </Box>
            </StyledPaper>
          </Grid>
        </Box>
      )}
    </>
  )
}
