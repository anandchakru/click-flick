import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { addToAlbumAsync, AppImageBlob, fetchAlbumAsync, selectAlbumGhPageImages, selectAlbumStatus } from './AlbumSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Box, Card, CardActionArea, CardContent, CardMedia, Backdrop, CircularProgress, Grid, IconButton, SxProps, Typography, AppBar, Toolbar, Button } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Dialog from '@mui/material/Dialog'
import { selectGhUser } from '../auth/AuthSlice'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewCompactIcon from '@mui/icons-material/ViewCompact'
import { compress } from './compress'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Masonry } from '@mui/lab'

const opacity5 = {
  opacity: 0.1,
  transitionProperty: 'opacity',
  transitionDelay: '0.1s',
}
const opaqueOnBlur = {
  ...opacity5,
  '&:hover': {
    opacity: 1,
    backgroundColor: '#33333344',
  }
} as SxProps
const fsButtonStyles = {
  ...opaqueOnBlur,
  userSelect: 'none',
  position: 'absolute',
  top: 0,
  width: '35vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  transitionProperty: 'opacity',
  transitionDelay: '0.1s',
} as SxProps
const masonryImg = {
  borderRadius: 4, display: 'block', width: '100%',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
}

type FullscreenImageProp = {
  currentImage: any
  setCurrentImage: any
  next: any
  prev: any
}

const FullscreenImage = ({ currentImage, setCurrentImage, next, prev }: FullscreenImageProp) => <Dialog onClose={() => setCurrentImage(-1)}
  open={(currentImage) ? true : false} fullScreen
  sx={{ userSelect: 'none', backgroundColor: '#ffffffee', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  {currentImage && <Card sx={{ userSelect: 'none', }}>
    {prev >= 0 && <Box sx={{
      ...fsButtonStyles,
      userSelect: 'none',
      left: 0,
    }} onClick={() => { setCurrentImage(prev) }}><ChevronLeftIcon sx={{ userSelect: 'none', }} /></Box>}
    <CardMedia component="img" sx={{ userSelect: 'none', objectFit: 'contain', width: '100%', height: '100vh' }}
      onClick={() => { setCurrentImage(-1) }}
      image={currentImage} alt={'__' + currentImage} />
    {next && <Box sx={{
      ...fsButtonStyles,
      userSelect: 'none',
      right: 0,
      justifyContent: 'flex-end',
    }} onClick={() => { setCurrentImage(next) }}><ChevronRightIcon /></Box>}
  </Card>}
</Dialog>

function Album() {
  const albumGhPageImages = useAppSelector(selectAlbumGhPageImages)
  const status = useAppSelector(selectAlbumStatus)
  const { albumId, owner } = useParams()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const ghUser = useAppSelector(selectGhUser)
  const [currentImage, setCurrentImage] = useState<number>(searchParams && searchParams.get("image") ? parseInt(searchParams.get("image") as string) : -1)

  const [images, setImages] = useState<{ [x: number]: AppImageBlob }>({})
  const [compressing, setCompressing] = useState<boolean>(false)
  const [isMasonry, setMasonry] = useState<boolean>(true)

  const [newImages, setNewImages] = useState<File[]>([])

  //const navigate = useNavigate()

  useEffect(() => {
    if (albumId && ghUser) {
      dispatch(fetchAlbumAsync({ owner: owner ? owner : ghUser, name: albumId }))
    }
  }, [albumId, ghUser, owner, dispatch])
  return (
    <div>
      <AppBar position='sticky' color="default" sx={{ marginBottom: '24px' }}>
        <Toolbar disableGutters>
          <IconButton size="large" aria-label="account of current user" aria-controls="gallery-appbar" aria-haspopup="true"
            onClick={() => {
              if (albumId && ghUser) {
                dispatch(fetchAlbumAsync({ owner: owner ? owner : ghUser, name: albumId }))
              }
            }} color="inherit" >
            <RefreshIcon />
          </IconButton>
          {isMasonry ? <IconButton aria-label="Switch to Grid View" color="inherit" onClick={() => setMasonry(false)}>
            <GridViewIcon />
          </IconButton> : <IconButton aria-label="Switch to Masonary View" color="inherit" onClick={() => setMasonry(true)}>
            <ViewCompactIcon />
          </IconButton>}
          <IconButton aria-label="View on Github" color="primary">
            <label htmlFor="raised-button-file">
              <AddAPhotoIcon />
            </label>
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div">
              {albumGhPageImages?.album?.title || albumId}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {isMasonry ? <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} spacing={2}>
        {/* Upload pendingg images */}
        {images && Object.keys(images).map((image, index) => <Box key={index} height="250">
          {/* <img loading="lazy" style={{ ...masonryImg, opacity: 0.3 }} src={URL.createObjectURL(images[image as any].blob)} alt={images[image as any].name} /> */}
          <Typography variant="caption" display="block" color="text.secondary">
            (upload pending)
          </Typography>
        </Box>)}
        {/* Album images */}
        {albumGhPageImages?.photos && albumGhPageImages?.photos.map((image, index) => <Box key={index}
          onClick={() => {
            setCurrentImage(index)
          }}>
          <img loading="lazy" style={{ ...masonryImg }} src={image} alt={`${index}`} />
        </Box>)}
      </Masonry> : <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* Upload pendingg images */}
        {images && Object.keys(images).map((image, index) => <Grid key={index} item xs={6} sm={4} md={3} lg={2}><Card sx={{ maxWidth: 250, opacity: 0.5 }}>
          <CardActionArea>
            {/* <CardMedia component="img" height="250" sx={{ objectFit: 'cover' }} loading="lazy" image={URL.createObjectURL(images[image as any].blob)} alt={images[image as any].name} /> */}
            <CardContent>
              <Typography variant="body2">
                {images[image as any].name}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                (upload pending)
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>)}
        {/* Album images */}
        {albumGhPageImages?.photos && albumGhPageImages?.photos.map((image, index) => <Grid key={index} item xs={6} sm={4} md={3} lg={2}><Card sx={{ maxWidth: 250, }}>
          <CardActionArea>
            <CardMedia component="img" height="250" sx={{ objectFit: 'cover' }} loading="lazy" image={image} alt={`${image}`}
              onClick={() => {
                setCurrentImage(index)
              }} />
            <CardContent>
              <Typography variant="body2">
                {index}
              </Typography>
              <Typography variant="caption" display="none" color="text.secondary">
                {Math.floor(index / 1000)} KB
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>)}
      </Grid>}
      {/* File upload */}
      <input
        accept="image/jpeg"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={async (event) => {
          const elem = event.target as HTMLInputElement
          if (elem && elem.files) {
            const files = Array.from(elem.files)
            setCompressing(true)
            setImages(await compress(files))
            setNewImages(files)
            setCompressing(false)
          }
        }} />
      <Box mt={10}>
        <Backdrop sx={{ backgroundColor: '#ffffffee', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={compressing || status === 'loading'}>
          {(compressing || status === 'loading') && <CircularProgress />}
        </Backdrop>
      </Box>
      {albumId && newImages && newImages.length > 0 && <Button sx={{}} variant="contained" color="primary" onClick={async () => {
        await dispatch(addToAlbumAsync({ albumSlug: albumId, images: newImages }))
        setImages([])
      }} disabled={!images || Object.keys(images).length === 0}>Upload</Button>}
      {albumGhPageImages?.photos?.length && <FullscreenImage
        currentImage={albumGhPageImages?.photos[currentImage]}
        prev={currentImage >= 0 ? currentImage - 1 : undefined}
        next={albumGhPageImages && currentImage < albumGhPageImages?.photos?.length - 1 ? currentImage + 1 : undefined}
        setCurrentImage={setCurrentImage} />}
    </div>
  )
}

export default Album