import { RootState } from '../../app/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AppCredential } from '../auth/AuthSlice'

export interface GalleryRepoInfo {
  data?: any
}

export interface GalleryInfo { // https://docs.github.com/en/rest/reference/repos
  galleryInfo?: GalleryRepoInfo
}

export interface GalleryMeta {
  cover: string
  name: string
  count: number
  uri: string
}
export interface GalleryState {
  status: 'idle' | 'loading' | 'failed'
  gallery?: GalleryInfo
  meta?: GalleryMeta[]
}

const initialState: GalleryState = {
  status: 'idle',
}

export const fetchGalleryAsync = createAsyncThunk(
  'gallery/fetch', async (nw: string, { getState }) => {
    const state = getState() as RootState
    if (state.auth.credential) {
      const { accessToken, uid } = state.auth.credential as AppCredential
      if (!state.gallery.gallery) {
        return {
          data: [{
            'cover': `TODO: /api/${uid}/gallery/list`,
            'name': `Gallery name`,
            'count': 1,
            'uri': `/api/${uid}/gallery/list`
          }]
        }
      }
    }
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
        if (action.payload) state.meta = action.payload.data
      }).addCase(fetchGalleryAsync.rejected, (state) => {
        state.status = 'idle'
      })
  }
})

export default gallerySlice.reducer
export const selectGalleryMeta = (state: RootState) => state.gallery.meta
export const selectGalleryStatus = (state: RootState) => state.gallery.status

// export const {  } = gallerySlice.actions