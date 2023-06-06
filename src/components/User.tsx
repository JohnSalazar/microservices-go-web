import { useEffect, useState } from 'react'
import { Avatar, Menu, MenuItem } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAuth } from '@/contexts/AuthContext'
import ConfigService from '@/services/config-service'

import ToggleTheme from './header/ToggleTheme'
import AuthLogin from './signin/AuthSignin'

export default function User() {
  const { customer, isAuthenticated, signOut, isManager } = useAuth()
  const router = useRouter()

  const [defaultAvatar, setDefaultAvatar] = useState(false)
  const [returnURL, setReturnURL] = useState('/profile')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setAnchorEl(null)
    setTimeout(() => {
      signOut()
      if (isManager) router.push(`/signin?returnURL=${router.pathname}`)
    }, 200)
  }

  useEffect(() => {
    isManager
      ? setReturnURL(`/manager/profile?returnURL=${router.pathname}`)
      : setReturnURL('/profile')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManager])

  return (
    <>
      <Avatar
        onClick={handleClick}
        sx={{ width: 30, height: 30, cursor: 'pointer' }}
      >
        {!defaultAvatar ? (
          <Image
            id="avatar-image"
            src={LoadAvatarImage(customer?.avatar)}
            onError={() => setDefaultAvatar(true)}
            alt="user"
            width={30}
            height={30}
          />
        ) : (
          <Image
            id="avatar-image"
            src={LoadDefaultAvatarImage()}
            alt="user"
            width={30}
            height={30}
          />
        )}
      </Avatar>
      {!isAuthenticated ? (
        <Menu
          id="signin"
          aria-labelledby="signin menu"
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{ maxWidth: '330px' }}
        >
          <MenuItem
            sx={{
              '&:hover': { backgroundColor: 'transparent' },
              '&:focus': { backgroundColor: 'transparent' },
            }}
          >
            <AuthLogin />
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          id="user"
          aria-labelledby="user menu"
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {!isManager && (
            <Link href={'/orders'}>
              <MenuItem>My Orders</MenuItem>
            </Link>
          )}
          <Link href={returnURL}>
            <MenuItem>Profile</MenuItem>
          </Link>
          <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          <MenuItem>
            <ToggleTheme />
          </MenuItem>
        </Menu>
      )}
    </>
  )
}

function LoadAvatarImage(avatar?: string): string {
  return avatar ? avatar : LoadDefaultAvatarImage()
}

function LoadDefaultAvatarImage(): string {
  const { GetConfig } = ConfigService()
  const config = GetConfig()

  return config.defaultAvatarImage
}
