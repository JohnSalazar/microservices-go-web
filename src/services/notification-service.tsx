import { toast } from 'react-toastify'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import BlockIcon from '@mui/icons-material/Block'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import MailIcon from '@mui/icons-material/Mail'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

import { NotificationType } from '@/types/notification-type'

import 'react-toastify/dist/ReactToastify.css'

export default function NotificationService() {
  const LoginFailure = (error: string) => {
    const options: NotificationType = {
      title: 'Failed to login',
      content: error,
      icon: <AccountCircleIcon />,
      timeout: 3000,
    }

    toast.error(notifyBox(options), { autoClose: options.timeout })
  }

  const AccessDenied = () => {
    const options: NotificationType = {
      title: 'No access permission',
      content: 'you do not have permission to perform this procedure',
      icon: <BlockIcon />,
      timeout: 3000,
    }

    toast.error(notifyBox(options))
  }

  const Error = (err: any) => {
    const options: NotificationType = {
      title: 'Error occurred',
      content: err,
      icon: <ErrorOutlineIcon />,
      timeout: 6000,
    }

    toast.error(notifyBox(options), { autoClose: options.timeout })
  }

  const RequestPasswordUpdate = () => {
    const options: NotificationType = {
      title: 'Request Password Update',
      content: 'check your email',
      icon: <MailIcon />,
      timeout: 3000,
    }

    toast.info(notifyBox(options), { autoClose: options.timeout })
  }

  const CredentialsUpdate = () => {
    const options: NotificationType = {
      title: 'Credentials Update',
      content: 'your credentials have been updated',
      icon: <VerifiedUserIcon />,
      timeout: 2500,
    }

    toast.success(notifyBox(options), { autoClose: options.timeout })
  }

  const DeliveryAddress = () => {
    const options: NotificationType = {
      title: 'Delivery Address',
      content: 'please select a delivery address',
      icon: <LocalShippingIcon />,
      timeout: 2500,
    }

    toast.warning(notifyBox(options), { autoClose: options.timeout })
  }

  const SendPayment = () => {
    const options: NotificationType = {
      title: 'Payment Send',
      content:
        'your payment request has been submitted and will be processed. You will be redirected to track the status of the purchase',
      icon: <AccountBalanceIcon />,
      timeout: 3000,
    }

    toast.success(notifyBox(options), { autoClose: options.timeout })
  }

  return {
    LoginFailure,
    AccessDenied,
    Error,
    RequestPasswordUpdate,
    CredentialsUpdate,
    DeliveryAddress,
    SendPayment,
  }
}

const notifyBox = (props: NotificationType) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ alignItems: 'auto' }}>
      <div style={{ fontSize: '17px', fontWeight: '200', padding: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {props.icon}
          <span style={{ paddingLeft: '10px' }}>{props.title}</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '14px' }}>{props.content}</p>
        </div>
      </div>
    </div>
  </div>
)
