import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { AppCredential, authInitAsync, authStateChange, AUTH_CREDENTIAL, fireauth, selectAuthCredential, selectAuthInitStatus, selectAuthUser, setAuthCredentials } from './features/auth/AuthSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { Backdrop, Box, CircularProgress, Container, Paper, Typography } from '@mui/material';
import ResponsiveAppBar from './features/utils/ResponsiveAppBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Home from './features/home/Home';
import Login from './features/auth/Login';
import ProtectedRoute from './features/auth/ProtectedRoute';
import Gallery from './features/gallery/Gallery';
import Profile from './features/profile/Profile';
import { selectGalleryStatus } from './features/gallery/GallerySlice';
import { selectAlbumStatus } from './features/album/AlbumSlice';
import { BUILDINFO } from './app/buildinfo';
import NewAlbum from './features/album/NewAlbum';
import Album from './features/album/Album';

function App() {
  const authUser = useAppSelector(selectAuthUser)
  const authInitStatus = useAppSelector(selectAuthInitStatus)
  const authCredential = useAppSelector(selectAuthCredential)
  const galleryStatus = useAppSelector(selectGalleryStatus)
  const albumStatus = useAppSelector(selectAlbumStatus)
  const dispatch = useAppDispatch();

  useEffect(() => {
    // first time app load (already signed in)
    // dispatch(fetchGalleryAsync(''))
    onAuthStateChanged(fireauth, (usr) => {
      if (usr) {
        dispatch(authStateChange({
          user: {
            uid: usr.uid,
            displayName: usr.displayName,
            email: usr.email,
            photoURL: usr.photoURL,
            providerId: usr.providerId,
            emailVerified: usr.emailVerified,
          }
        }))
        // dispatch(fetchGalleryAsync('')) // first time signed in
      }
    })
  }, [dispatch])

  useEffect(() => {
    dispatch(authInitAsync({}))
  }, [dispatch])

  useEffect(() => {
    if (authCredential) {
      const tmp = localStorage.getItem(AUTH_CREDENTIAL)
      if (!tmp || (authUser && (JSON.parse(tmp) as AppCredential).uid !== authUser.uid)) {
        localStorage.setItem(AUTH_CREDENTIAL, JSON.stringify(authCredential))
      }
    } else {
      const tmp = localStorage.getItem(AUTH_CREDENTIAL)
      if (tmp) {
        dispatch(setAuthCredentials(JSON.parse(tmp)))
      }
    }
  }, [authCredential, authUser, dispatch])

  return (<Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
    {/* Nav Bar */}
    <ResponsiveAppBar />
    <Paper sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main Page Content */}
      <Container sx={{ textAlign: 'center', marginBottom: '60px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute redirectTo="/login" />}> {/* https://stackoverflow.com/a/69592617 */}
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/album" element={<Navigate to="/gallery" />} />
            <Route path="/album/new" element={<NewAlbum />} />
            <Route path="/album/:albumId" element={<Album />} />
            <Route path="/album/:owner/:albumId" element={<Album />} />
          </Route>
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
        <Backdrop
          sx={{ backgroundColor: '#ffffffee', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={authInitStatus === 'loading' || galleryStatus === 'loading' || albumStatus === 'loading'}>
          <CircularProgress />
        </Backdrop>
      </Container>

      {/* Footer */}
      {/* https://stackoverflow.com/a/47071856/234110 */}
      <Container maxWidth="xl" sx={{ height: '50px', boxShadow: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            {BUILDINFO.hash?.substring(0, 7)}
          </Typography>
        </Box>
      </Container>
    </Paper>
  </Box>
  )
}

export default App

