import { RootState } from '../../app/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AppCredential, fireauth } from '../auth/AuthSlice'
import axios from 'axios'
import { API_BASE } from '../../app/constants'

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export interface AppImageBlob {
  key: number
  name: string
  blob: Blob
  b64: string
  index: number
  selected: boolean
}
export interface PullRequestInfo {
  data?: any
}
export interface CreateRepoInfo {
  data?: any
  // id: number
  // name: string
  // description: string | null
  // url: string
  // html_url: string
  // contents_url: string
}

export interface PullRequestInfo {
  data?: any
}
export interface GhPagesInfo {
  data?: any
}

export interface MetaInfo {
  data?: any
}
export interface AlbumRemoteInfo { // https://docs.github.com/en/rest/reference/repos
  pr?: PullRequestInfo
  repo?: CreateRepoInfo
  merge?: PullRequestInfo
  ghPages?: GhPagesInfo
  meta?: MetaInfo
}

export interface ImgInfo {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
}
export interface GhPageImageInfo {
  img: ImgInfo[]
  repoInfo: CreateRepoInfo
}

export interface AlbumInfo {
  albumCover: string
  albumId: number
  byInviteOnly: boolean
  slug: string
  dynamicLink: string
  photoCount: number
  shortMsg: string
  title: string
  viewCount: number
}
export interface AlbumWithPhotos {
  album: AlbumInfo
  photos: string[]
}

export interface CreateAlbumResponse {
  albumGhInfo?: any,
  pullReqGhInfo?: any,
  mergeGhInfo?: any,
  updateGalleryGhInfo?: any,
  ghPagesGhInfo?: any,
  error?: any,
}

export interface AlbumState {
  status: 'idle' | 'loading' | 'failed'
  albumRemoteInfo?: CreateAlbumResponse
  albumGhPageImages?: AlbumWithPhotos
}

const initialState: AlbumState = {
  status: 'idle',
}

export const addToAlbumAsync = createAsyncThunk('album/edit', async ({ albumSlug, images }: { albumSlug: string, images: File[] }, { getState }) => {
  const state = getState() as RootState
  if (state.auth.isAuthenticated) {
    const filesForm = new FormData();
    images.forEach((file) => {
      filesForm.append("files", file);
    })
    return axios.post(`${API_BASE}apps/album/${albumSlug}/upload`, filesForm, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${await fireauth.currentUser?.getIdToken()}`
      }
    })
  }
})

export const createAlbumAsync = createAsyncThunk(
  'album/create', async ({ repoName, albumName, images }: { repoName: string, albumName: string, images: File[]/*{ [x: number]: AppImageBlob }*/ }, { getState }) => {
    const state = getState() as RootState
    //const { accessToken, ghuser } = state.auth.credential as AppCredential
    if (state.auth.isAuthenticated) {
      return axios.post(`${API_BASE}apps/album`, {
        title: albumName,
        byInviteOnly: true
      }, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": `Bearer ${await fireauth.currentUser?.getIdToken()}`
        }
      }).then(async response => {
        console.log(`created album ${JSON.stringify(response.data)}, uploading images ${JSON.stringify(images)}`)
        const filesForm = new FormData();
        images.forEach((file) => {
          filesForm.append("files", file);
        })
        return axios.post(`${API_BASE}apps/album/${response.data.slug}/upload`, filesForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${await fireauth.currentUser?.getIdToken()}`
          }
        })
      })
    }
  }
)

export const fetchAlbumAsync = createAsyncThunk(
  'album/fetch', async ({ name, owner }: { name: string, owner: string }, { getState }) => {
    const state = getState() as RootState
    if (state.auth.isAuthenticated) {
      console.log(`Auth true`)
    }
    //if (state.auth.isAuthenticated) {
    //const { accessToken } = state.auth.credential as AppCredential
    //console.log(`accessToken ${accessToken} name ${name} owner ${owner}`)
    //const octokit = new AppOctokit({ auth: accessToken })
    //const repo = await octokit.request(`GET /repos/${owner}/${name}`)
    //const result = await octokit.request(`GET /repos/${owner}/${name}/contents/public/img`)
    //return undefined
    //}
    return axios.get(`${API_BASE}apps/album/bys/${name}`, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${await fireauth.currentUser?.getIdToken()}`
      }
    }).then(response => response.data)
  }
)

export const addImagesToAlbumAsync = createAsyncThunk(
  'album/addImg', async ({ repoName, images, owner, albumName }: { repoName: string, images: { [x: number]: AppImageBlob }, albumName: string, owner: string }, { getState }) => {
    const state = getState() as RootState
    if (state.auth.isAuthenticated) {
      const { accessToken, ghuser } = state.auth.credential as AppCredential
      if (accessToken) {
        console.log(`accessToken ${accessToken}, ghuser ${ghuser}`)
        //return await addImagesToAlbum(ghuser, accessToken, repoName, albumName, images, owner)
        return {}
      }
    }
  }
)
export const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
  }, extraReducers: (builder) => {
    builder
      .addCase(createAlbumAsync.pending, (state) => {
        state.status = 'loading'
      }).addCase(createAlbumAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        if (action.payload) {
          state.albumRemoteInfo = action.payload as any
        }
      }).addCase(createAlbumAsync.rejected, (state) => {
        state.status = 'idle'
      }).addCase(fetchAlbumAsync.pending, (state) => {
        state.status = 'loading'
      }).addCase(fetchAlbumAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.albumGhPageImages = action.payload
      }).addCase(fetchAlbumAsync.rejected, (state) => {
        state.status = 'idle'
      }).addCase(addImagesToAlbumAsync.pending, (state) => {
        state.status = 'loading'
      }).addCase(addImagesToAlbumAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        if (action.payload) {
          // TODO: Update state.albumRemoteInfo
          // state.albumRemoteInfo = action.payload
        }
      }).addCase(addImagesToAlbumAsync.rejected, (state) => {
        state.status = 'idle'
      })
  }
})

export default albumSlice.reducer
export const selectAlbum = (state: RootState) => state.album.albumRemoteInfo
export const selectAlbumStatus = (state: RootState) => state.album.status
export const selectAlbumGhPageImages = (state: RootState) => state.album.albumGhPageImages
