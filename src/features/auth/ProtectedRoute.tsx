import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectIsAuth } from './AuthSlice'
import {
  Navigate,
  useLocation,
  Outlet,
} from 'react-router-dom'

import { Box } from '@mui/material'

type ProtectedRedirectProp = {
  redirectTo: string
}

const ProtectedRoute = (props: ProtectedRedirectProp) => {
  const isAuth = useAppSelector(selectIsAuth)
  let location = useLocation()
  return isAuth ? (<Box mt={4}> <Outlet /> </Box>)
    : (<Navigate to={props.redirectTo} state={{ from: location }} />)
}

export default ProtectedRoute