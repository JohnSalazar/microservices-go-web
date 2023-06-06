import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

import { useAuth } from '@/contexts/AuthContext'

import AuthLogin from './AuthSignin'

export default function ModalSignin() {
  const { openModalSignin, setOpenModalSignin } = useAuth()

  const handleClose = () => {
    setOpenModalSignin(false)
  }

  return (
    <>
      <Dialog open={openModalSignin} onClose={handleClose}>
        <DialogTitle>Signin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            É necessário realizar o login, e após, refaça a operação atual
          </DialogContentText>
          <AuthLogin />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
