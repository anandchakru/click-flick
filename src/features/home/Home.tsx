import React from 'react'
import { Box, Typography } from '@mui/material'

function Home() {
  return (
    <Box sx={{
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      flexDirection: 'column'
    }} mt={12}>
      <Typography variant="h1" component="div" gutterBottom sx={{ textAlign: 'center' }}>
        Click Flick
      </Typography>
      <Typography variant="h6" gutterBottom component="div">
        Click & flick your photos
      </Typography>
    </Box>
  )
}

export default Home
