import { Avatar as MuiAvatar, Button as MuiButton, ButtonGroup, makeStyles } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { CloudUpload as MuiCloudUpload, Delete as MuiDelete, Send as MuiSend } from '@material-ui/icons'
import { spacing } from '@material-ui/system'
import { Avatar, Button, Stack } from '@mui/material'
import React, { createRef, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useUploadImageMutation } from 'src/pages/redux/apis/userApi'
import styled from 'styled-components'

const UploadIcon = styled(MuiCloudUpload)(spacing)
const Submit = styled(MuiSend)(spacing)

const CenteredContent = styled.div`
  text-align: center;
`

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  large: {
    width: theme.spacing(24),
    height: theme.spacing(24)
  }
}))

const BigAvatar = styled(MuiAvatar)`
  // width: 200x;
  // height: 200px;
  margin: 0 auto 16px;
  // border: 1px solid ${grey[500]};
  // box-shadow: 0 0 1px 0 ${grey[500]} inset, 0 0 1px 0 ${grey[500]};
`

const AvatarUpload = () => {
  const user = useSelector(state=>state.userState.user);
  const id = user?._id
  const photo = user?.photo
  const classes = useStyles()

  const [image, _setImage] = useState({preview: '', data: ''})
  const inputFileRef = createRef(null)
  const [uploadImage] = useUploadImageMutation();

  const setImage = newImage => {
    _setImage(newImage)
  }

  const handleOnChange = event => {
    const newImage = event.target?.files?.[0]
    {
      setImage({
        preview: URL?.createObjectURL(newImage),
        data: newImage,
      })
    }
  }

  /**
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */

  const handleSubmit = async (e) => {
    e.preventDefault()
    const id = user?._id
    const formData = new FormData()
    formData.append('file', image.data)
    formData.append('id', id)
    const res = await uploadImage( formData)
    if (res.data.status == 'fail' )
    {

      // toast.error(
      // 'Please input the profile picture'
      // )
    } else
      if(res?.data?.status == "success") {
        toast.success(
          'Successfully uploaded the profile picture'
          )
        }

      }

  return (
    <CenteredContent >
      <form  onSubmit={handleSubmit} sx={{display:'flex', justifyContent: 'center'}}>
      {!user || photo=='default.png' || !image.preview==''?
      <BigAvatar
        className={classes.large}
        alt='Avatar'
        src={image?.preview}
      />:
      <BigAvatar
        className={classes.large}
        alt='Avatar'
        src={`http://localhost:8000/${photo}`}
      />
      }
        <label variant="contained" htmlFor='avatar-image-upload' spacing={4} >
            <input
              ref={inputFileRef}
              accept='image/*'
              hidden
              id='avatar-image-upload'
              type='file'
              name="file"
              onChange={handleOnChange}
            />
          <ButtonGroup orientation='vertical'>
            <Button small variant='outlined'  component="span" color="primary" mb={2} >
              <UploadIcon mr={2} />
              Upload
            </Button>
            <Button type='submit' variant='outlined' color='primary' mb={2} value='Upload Photo' >
              <Submit mr={2}/>
              submit
            </Button>

          </ButtonGroup>
        </label>
      </form>
    </CenteredContent>
  )
}

export default AvatarUpload
