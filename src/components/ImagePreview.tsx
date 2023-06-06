import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'

import ConfigService from '@/services/config-service'
import ErrorService from '@/services/error-service'
import FileUploadService from '@/services/file-upload-service'

type ImagePreviewProps = {
  title: string
  description: string
  // folderName: string
  saveImage: boolean
  setSaveImage: Dispatch<SetStateAction<boolean>>
  urlImage: string | null
  setUrlImage: Dispatch<SetStateAction<string | null>>
  // imageId: string | undefined
  // extension?: string
  setKeepWindowOpen?: Dispatch<SetStateAction<boolean>>
}

export default function ImagePreview({
  title,
  description,
  // folderName,
  saveImage,
  setSaveImage,
  urlImage,
  setUrlImage,
  // imageId = 'default',
  // extension = 'jpg',
  setKeepWindowOpen,
}: ImagePreviewProps) {
  const { GetConfig } = ConfigService()
  const config = GetConfig()
  const { ErrorHandler } = ErrorService()

  const { Upload, Load } = FileUploadService()
  const [fileImage, setFileImage] = useState<string>()
  const [currentFile, setCurrentFile] = useState<File | null>()
  const [progress, setProgress] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [loadingSuccess, setLoadingSuccess] = useState(false)

  // const acceptImage = extension == 'jpg' ? '.jpg, .jpeg|image/*' : 'image/png'
  const acceptImage = 'image/png, image/jpeg'

  const handleInputImage = () => {
    remove()
    const fileSelect = document.getElementById('inputImage')
    fileSelect?.click()
  }

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const selectedFiles = files as FileList
    setCurrentFile(selectedFiles?.[0])
    setProgress(0)
  }

  const load = async () => {
    setProgress(0)
    if (!currentFile) return

    Load()
      .then(async (response) => {
        const buffer = await currentFile.arrayBuffer()
        const blob = new Blob([buffer], { type: currentFile.type })
        // const blob = new Blob([buffer], { type: `image/${currentFile.type}` })
        const image = URL.createObjectURL(blob)

        // await upload()

        setFileImage(image)
        setMessage(response.data.message)
        setLoadingSuccess(true)
      })
      .catch((err) => {
        setProgress(0)

        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message)
        } else {
          setMessage('could not upload the file')
        }

        setCurrentFile(undefined)
      })
  }

  const upload = async () => {
    if (!currentFile) return
    // if (!currentFile || !imageId) return

    // const fileName = `${imageId}.${currentFile.name.split('.').pop()}`

    Upload(
      currentFile,
      (event: any) => {
        setProgress(Math.round((100 * event.loaded) / event.total))
      }
      // folderName,
      // fileName
    )
      .then((res) => {
        console.log('saved!')
        setUrlImage(res.data.url)
      })
      .catch((error: any) => {
        ErrorHandler(error)
      })
  }

  const handleRemove = async () => {
    setFileImage('')
    remove()
  }

  const remove = async () => {
    setCurrentFile(null)
    setLoadingSuccess(false)
    setMessage('')
  }

  useEffect(() => {
    if (urlImage) setFileImage(urlImage)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlImage])

  // useEffect(() => {
  //   if (imageId) setFileImage(`${folderName}/${imageId}.${extension}`)

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [imageId])

  useEffect(() => {
    if (saveImage && currentFile) {
      upload().then((res) => res)
    }

    if (saveImage) {
      remove()
      setSaveImage(false)
      if (setKeepWindowOpen) setKeepWindowOpen(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveImage])

  return (
    <Grid item>
      {/* <Card sx={{ width: '260px' }}> */}
      <Card sx={{ minWidth: '260px' }}>
        <CardActionArea>
          <CardMedia
            id="fileImage"
            component="img"
            height="300"
            image={fileImage ? fileImage : config.defaultProductImage}
            // image={fileImage ? fileImage : config.defaultProductImage}
            onError={() => setFileImage('')}
            alt="image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Stack alignItems={'center'}>
        <Box sx={{ mt: 2, mb: 1 }}>
          <input
            id="inputImage"
            type="file"
            onChange={selectFile}
            accept={acceptImage}
            style={{ display: 'none' }}
          />
          <Button size="small" variant="contained" onClick={handleInputImage}>
            Select an image
          </Button>
        </Box>
        <Divider variant="middle" />
        <Box sx={{ mt: 1, mb: 1 }}>
          <Stack direction="row" spacing={3}>
            <Button
              variant="contained"
              size="small"
              disabled={loadingSuccess || !currentFile}
              onClick={load}
              startIcon={<CloudUploadIcon />}
              color="success"
            >
              Upload
            </Button>
            <Button
              variant="contained"
              size="small"
              disabled={!loadingSuccess}
              onClick={handleRemove}
              color="error"
            >
              Remove
            </Button>
          </Stack>

          {currentFile && (
            <Box
              className="progress-bar progress-bar-info"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: progress + '%' }}
            >
              {progress}%
            </Box>
          )}

          {message && (
            <Box className="alert alert-secondary mt-3" role="alert">
              {message}
            </Box>
          )}
        </Box>
      </Stack>
    </Grid>
  )
}
