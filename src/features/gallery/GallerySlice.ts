import { RootState } from '../../app/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fireauth } from '../auth/AuthSlice'
import axios from 'axios'
import { API_BASE } from '../../app/constants'

export interface GalleryRepoInfo {
  data?: any
}

export interface GalleryInfo { // https://docs.github.com/en/rest/reference/repos
  galleryInfo?: GalleryRepoInfo
}

export interface Page {
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
}

export interface GalleryMeta {
  first: boolean
  last: boolean
  numberOfElements: number
  size: number
  totalElements: number
  totalPages: number
  pageable: Page
  content: GalleryContent[]
}
export interface GalleryContent {
  title: string
  slug: string
  albumId: number
  albumCover: string
}
export interface GalleryState {
  status: 'idle' | 'loading' | 'failed'
  gallery?: GalleryInfo
  meta?: GalleryMeta
}

const initialState: GalleryState = {
  status: 'idle',
}

export const fetchGalleryAsync = createAsyncThunk(
  'gallery/fetch', async (nw: string, { getState }) => {
    const state = getState() as RootState
    if (state.auth.isAuthenticated) {
      console.log(`Auth true`)
    }
    return axios.get(`${API_BASE}apps/album/hosted`, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${await fireauth.currentUser?.getIdToken()}`
      }
    }).then(response => response.data)
  }
)

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
  }, extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryAsync.pending, (state) => {
        state.status = 'loading'
      }).addCase(fetchGalleryAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.meta = action.payload
      }).addCase(fetchGalleryAsync.rejected, (state) => {
        state.status = 'idle'
      })
  }
})

export default gallerySlice.reducer
export const selectGalleryMeta = (state: RootState) => state.gallery.meta
export const selectGalleryStatus = (state: RootState) => state.gallery.status

// export const {  } = gallerySlice.actions