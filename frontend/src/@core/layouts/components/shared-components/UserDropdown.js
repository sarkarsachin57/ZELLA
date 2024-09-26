import { getErrorMsg } from 'src/helpers/utils'

// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie';

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import { Avatar as MuiAvatar, Button as MuiButton, ButtonGroup, makeStyles } from '@material-ui/core'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

import { useLogoutUserMutation } from 'src/pages/redux/apis/authApi'
import { toast } from 'react-toastify'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  const user = useSelector(state => {
    return state.userState.user
  })
  console.log("user: ", user)
  const [cookies, setCookie, removeCookie] = useCookies(['authToken']);

  const [logoutUser, { isLoading, isSuccess, error, isError }] = useLogoutUserMutation()
  const router = useRouter()

  useEffect(() => {
    if (isSuccess) {
      window.location.href = '/login'
    }

    if (isError) {
      if (Array.isArray(error?.data?.error)) {
        error.data.error.forEach(el =>
          toast.error(el.message, {
            position: 'top-right'
          })
        )
      } else {
        toast.error(getErrorMsg(error), {
          position: 'top-right'
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const onLogoutHandler = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')

    // removeCookie('authToken', { path: '/' });
    window.location.href = '/login'

      // logoutUser()
  }

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}

        // badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
       {!user || user?.photo=='default.png'?
        <MuiAvatar
          sx={{ color: 'common.white', backgroundColor: 'primary.main', width: 30, height: 30, textTransform: 'capitalize' }}
          alt={user?.name}
          onClick={handleDropdownOpen}
        />:
        <MuiAvatar alt='Avatar'src={`http://localhost:8000/${user?.photo}`}/>
      }
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'

              // badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              {!user || user?.photo=='default.png' ?
                <MuiAvatar
                  sx={{ color: 'common.white', backgroundColor: 'primary.main', width: 30, height: 30, textTransform: 'capitalize' }}
                  alt={user?.name}
                  onClick={handleDropdownOpen}
                />:
                <MuiAvatar alt='Avatar'src={`http://localhost:8000/${user?.photo}`}/>
              }
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}> {user?.name?.slice(0, 10)} </Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {user?.role}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <Link href='/account' passHref = {true}>
          <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
            <Box sx={styles}>
              <AccountOutline sx={{ marginRight: 2 }} />
              Profile
            </Box>
          </MenuItem>
        </Link>
        <Divider />
        {/* <Link href='/settings'>
          <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
            <Box sx={styles}>
              <CogOutline sx={{ marginRight: 2 }} />
              Settings
            </Box>
          </MenuItem>
        </Link>
        <Divider /> */}
        <MenuItem sx={{ py: 2 }} onClick={() => onLogoutHandler()}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
