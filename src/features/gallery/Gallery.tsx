import { AppBar, Box, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchGalleryAsync, selectGalleryMeta } from './GallerySlice'
import RefreshIcon from '@mui/icons-material/Refresh'

function Gallery() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const galleryMeta = useAppSelector(selectGalleryMeta)
  useEffect(() => {
    dispatch(fetchGalleryAsync(''))
  }, [])
  return (
    <>
      <AppBar position='relative' color="default" sx={{ marginBottom: '24px' }}>
        <Toolbar disableGutters>
          <IconButton size="large" aria-label="account of current user" aria-controls="gallery-appbar" aria-haspopup="true"
            onClick={() => dispatch(fetchGalleryAsync(''))} color="inherit" >
            <RefreshIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div">
              Gallery
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {galleryMeta?.content?.map((galleryMetaItem, index) => <Grid key={index} item xs={6} sm={4} md={3} lg={2}>
          <Card sx={{ maxWidth: 250, }}>
            <CardActionArea onClick={() => navigate(`/album/${galleryMetaItem?.slug}`)}>
              <CardMedia component="img" height="250" sx={{ objectFit: 'cover' }}
                image={galleryMetaItem.albumCover ? galleryMetaItem.albumCover : `https://picsum.photos/300?grayscale&blur=1`} alt={galleryMetaItem.title} />
              <CardContent>
                <Typography variant="body2">
                  {galleryMetaItem.title}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {0} items
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>)}
      </Grid>
    </>
  )
}

export default Gallery