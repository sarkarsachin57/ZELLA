import { createApi, fe } from '@reduxjs/toolkit/query/react'
import customFetchBase from './customFetchBase'
import { useDispatch } from 'react-redux'
import { setConfigs } from '../features/configSlice'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { configApi } from './configApi'
import { logApi } from './logApi'
import axios from 'axios'
import head from 'next/head'
import { FormDropdown, FridgeOff } from 'mdi-material-ui'

const baseQuery = () => {
  return Promise.race([
    fetchBaseQuery({ baseUrl: 'http://localhost:5000/python-app', timeout: 3000 }),
    new Promise(resolve => setTimeout(() => resolve({ error: 'timed out' }), 3000))
  ])
}

/**
 * @author QmQ
 * This function is responsible for sending the requests to the flask server
 */
export const streamApi = createApi({
  reducerPath: 'streamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/python-app',
    timeout: 300000,
    maxBodyLength: 3 * 1024 * 1024 * 1024 // 3Gbyte
  }),
  tagTypes: ['Python', 'File', 'VideoFile'],
  endpoints: builder => {
    return {
      index: builder.query({
        query() {
          return {
            url: '/',
            method: 'GET'
          }
        },
        invalidatesTags: ['Python']
      }),

      connect_camera: builder.mutation({
        query(conn) {
          return {
            url: `/connect/${conn.tracking_mode}/${conn.camera_name}/` + `?cam_path= ${conn.video_path}`,
            method: 'GET'
          }
        },

        // async onQueryStarted(args, { dispatch, queryFulfilled }) {
        //   try {
        //       const { data } = await queryFulfilled;
        //       console.log("stream Api connect_camer", data);
        //       // if (data?.status === 'success') {
        //       //   await creatConfig(args);
        //       //   dispatch(configApi.util.updateQueryData('getAllConfigs', (aaa)=>{
        //       //     console.log("dispatch stream part", aa);
        //       //   }));
        //       // }
        //   } catch (error) {
        //     console.log(error);
        //   }
        // },
        invalidatesTags: ['Python']
      }),

      initialize_camera: builder.mutation({
        query(data) {
          const bbox = JSON.stringify(data.trackerInfo.bbox)
          const url = `initialize/${data.initEl.camera_name}/${data.trackerInfo.targetName}/${data.trackerInfo.frame_w}-${data.trackerInfo.frame_h}/${bbox}`

          return {
            url: url,
            method: 'GET'
          }
        },

        // async onQueryStarted(args, {dispatch, queryFulfilled}) {
        //   try {
        //     const { data } = await queryFulfilled;
        //     if(data.status == 'success') {
        //       console.log(data.image_data);
        //     }
        //   } catch(error) {
        //     console.log("error stream initialize part");
        //     console.log(error);
        //   }
        // },
        invalidatesTags: ['Python']
      }),

      show_frames: builder.mutation({
        query(conn) {
          return {
            url:
              `/show-frames/${conn.cam_name}` + `/${frame_w}` + `/${frame_h}` + `/${x}` + `/${y}` + `/${w}` + `/${h}`,
            method: 'GET'
          }
        },
        invalidatesTags: ['Python']
      }),

      show_messages: builder.mutation({
        query(conn) {
          return {
            url: `/show-messages/${conn.camera_name}`,
            method: 'GET'
          }
        },
        invalidatesTags: ['Python']
      }),

      messages: builder.mutation({
        query(conn) {
          return {
            url: `/messages/${conn.camera_name}`,
            method: 'GET'
          }
        },
        invalidatesTags: ['Python']
      }),

      terminate_camera: builder.mutation({
        query(conn) {
          return {
            url: `/terminate/${conn.camera_name}`,
            method: 'GET'
          }
        },
        invalidatesTags: ['Python']
      }),

      get_file_list: builder.query({
        query() {
          return {
            url: `/files`,
            method: 'GET'
          }
        },
        providesTags: ['File'],
        transformResponse: result => {
          return result
        }
      }),

      // For future usage QmQ
      getFilteredFiles: builder.mutation({
        query() {
          return {
            url: `/files/get_filtered`,
            method: 'POST',
            body: filter,
            credentials: 'include'
          }
        },
        providesTags: ['File'],
        transformResponse: result => {
          return result
        }
      }),

      uploadVideo: builder.mutation({
        query(data) {
          console.log('upload ====>', data.tracking_mode, data.vid_name, data.vid_ext)
          return {
            //   url: `/upload-offline-video/${data.tracking_mode}/${data.vid_name}/${data.vid_ext}`,
            url: `/upload-offline-video/${data.tracking_mode}/${data.vid_name}`,
            method: 'POST',
            body: data.formData
          }
        },

        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled
            console.log(' upload video file respond in the onquery start part =>', data)
            // dispatch(setUser(data.data.user));
          } catch (error) {}
        }
      }),

      initialize_offline_video: builder.mutation({
        query(data) {
          console.log('when offline video initialization===>', data)
          const bbox = JSON.stringify(data.trackerInfo.bbox)
          const url = `process-offline-video/sot/${data.initEl.camera_name}/${data.trackerInfo.frame_w}-${data.trackerInfo.frame_h}`

          return {
            url: url,
            method: 'POST',
            body: JSON.stringify(data.trackerInfo.init_info)
          }
        },

        // async onQueryStarted(args, {dispatch, queryFulfilled}) {
        //   try {
        //     const { data } = await queryFulfilled;
        //     if(data.status == 'success') {
        //       console.log(data.image_data);
        //     }
        //   } catch(error) {
        //     console.log("error stream initialize part");
        //     console.log(error);
        //   }
        // },
        invalidatesTags: ['Python']
      }),

      get_offline_progress: builder.mutation({
        query(conn) {
          return {
            url: `/offline-progress/${conn.camera_name}`,
            method: 'GET'
          }
        },
        transformResponse: result => {
          return result
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled
            // if(data.status == 'success') {
            //   console.log(data.image_data);
            // }
          } catch (error) {}
        }
      }),

      get_offline_logs: builder.mutation({
        query(conn) {
          return {
            url: `/offline-logs/${conn.camera_name}`,
            method: 'GET'
          }
        },
        transformResponse: result => {
          return result
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled
            // if(data.status == 'success') {
            //   console.log(data.image_data);
            // }
          } catch (error) {}
        }
      }),

      show_threads: builder.mutation({
        query() {
          return {
            url: `/show_threads`,
            method: 'GET'
          }
        },
        invalidatesTags: ['Python']
      }),

      check_stream: builder.mutation({
        query(conn) {
          return {
            url: `/streaming/${conn.camera_name}`,
            method: 'GET'
          }
        }
      }),
      addDetectionVideo: builder.mutation({
        query(formData) {
          return {
            url: '/offline-object-detection',
            method: 'POST',
            body: formData
          }
        },
        transformResponse: result => result,
        invalidatesTags: ['Python'],
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled
            console.log('upload video file response in the on query', data)
          } catch (error) {}
        }
      }),
      addDetectionCamera: builder.mutation({
        query(formData) {
          console.log('add detection camera', formData)
          return {
            url: '/online-object-detection',
            method: 'POST',
            body: formData
          }
        },
        transformResponse: result => result,
        invalidatesTags: ['Python'],
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled
            console.log('upload camera response in the on query', data)
          } catch (error) {}
        }
      })
    }
  }
})

const CHUNK_SIZE = 50 * 1024 * 1024

export const uploadChunkedFile = async data => {
  const { file, mode, uuidedName } = data
  const filename = file.name

  let start = 0

  while (1) {
    const formData = new FormData()
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)
    if (chunk.size === 0) {
      formData.append('file', chunk)
      const res = await axios.post('http://localhost:5000/chunked-model-upload', formData, {
        headers: {
          status: 'completed',
          'X-Chunk-Start': start,
          'X-Chunk-End': end,
          filename: filename,
          progress: 100,
          mode: mode,
          name: uuidedName
        }
      })
      return res
    }
    formData.append('file', chunk)
    await axios.post('http://localhost:5000/chunked-model-upload', formData, {
      headers: {
        status: 'uploading',
        'X-Chunk-Start': start,
        'X-Chunk-End': end,
        filename: filename,
        mode: mode,
        name: uuidedName
      },
      onUploadProgress: progressEvent => {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        // console.log('percent===>', percent)
      }
    })
    start = end
  }
}

export const uploadChunkedVideo = async data => {
  const { file, tracking_mode, filename } = data;
  let start = 0;
  while (1) {
    const formData = new FormData();
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    
    if(chunk.size === 0) {
      formData.append('file', chunk);
      const res = await axios.post(
        `http://localhost:5000/python-app/upload-offline-video/${tracking_mode}/${filename}`,
        formData,
        {
          headers: {
            status: 'completed',
            'X-Chunk-Start': start,
            'X-Chunk-End': end,
            filename: file.name
          }
        }
        )
      return res;
    }

    formData.append('file', chunk);
    await axios.post(
      `http://localhost:5000/python-app/upload-offline-video/${tracking_mode}/${filename}`,
      formData,
      {
        headers: {
          status: 'uploading',
          'X-Chunk-Start': start,
          'X-Chunk-End': end,
          filename: file.name
        },
        onUploadProgress: progressEvent => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          )
        }
      },
    )
    start = end;
  }
}


export const uploadChunkedDetectionVideo = async (configData) => {
  let start = 0;
  const formData = new FormData();
  formData.append('vid_name', configData.videoName);
  // formData.append('video', configData.videoFile)
  formData.append('classes', configData.classesFile);
  formData.append('model_metas', JSON.stringify(configData.modelList));
  formData.append('use_case', configData.useCase);
  while(1) {
    const end = Math.min(start + CHUNK_SIZE, configData.videoFile.size);
    const chunk = configData.videoFile.slice(start, end);

    if(chunk.size === 0) {
      formData.append('file', chunk);
      const res = await axios.post(
        `http://localhost:5000/python-app/offline-object-detection`,
        formData,
        {
          headers: {
            status: 'completed',
            'X-Chunk-Start': start,
            'X-Chunk-End': end,
            filename: configData.videoName
         }
        }
      )      
    return res;
    }

    formData.append('file', chunk);
    await axios.post(
      `http://localhost:5000/python-app/offline-object-detection`,
      formData,
      {
        headers: {
          status: 'uploading',
          'X-Chunk-Start': start,
          'X-Chunk-End': end,
          filename: configData.videoName
        },
        onDownloadProgress: progressEvent => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          )
        }
      },
    )
    start = end;
  }
}

export const {
  useConnect_cameraMutation,
  useShow_framesMutation,
  useShow_messagesMutation,
  useMessagesMutation,
  useTerminate_cameraMutation,
  useShow_threadsMutation,
  useIndexQuery,
  useInitialize_cameraMutation,
  useUploadVideoMutation,
  useInitialize_offline_videoMutation,
  useGet_offline_progressMutation,
  useGet_offline_logsMutation,
  useGet_file_listQuery,
  useGetFilteredFilesMutation,
  useCheck_streamMutation,
  useAddDetectionVideoMutation,
  useAddDetectionCameraMutation
} = streamApi
