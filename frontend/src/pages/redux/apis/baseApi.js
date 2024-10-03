import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from './customFetchBase';
import { 
  appendProjectItem, 
  setDataSetList, 
  setProjectList, 
  appendDataSetItem, 
  updateLatestProjectUrl ,
  setRunLosgList,
  setTrainingViewDetail,
  setDatasetInfo,
  setViewSample
} from '../features/baseSlice';

/**
 * 👇 @file handles the auth apis
 */


export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: customFetchBase,
    endpoints: (builder)=>({
      getProjectList: builder.mutation({
        query(data) {
          return {
            url: 'get-project-list',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log('projectList: api===>', data)
            dispatch(setProjectList(data.project_list));
          } catch (error) {}
        },
      }),
      createProject: builder.mutation({
        query(data) {
          return {
            url: 'create-project',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(appendProjectItem(data.data))
          } catch (error) {}
        },
      }),
      getDataSetList: builder.mutation({
        query(data) {
          return {
            url: 'get-dataset-list',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setDataSetList(data.dataset_list));
          } catch (error) {}
        },
      }),
      uploadData: builder.mutation({
        query(data) {
          return {
            url: 'upload-data',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(appendDataSetItem(data.data))
          } catch (error) {}
        },
      }),
      updateLatestUrl: builder.mutation({
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            dispatch(updateLatestProjectUrl(args))
          } catch(error) {
            throw new error;
          }
        }
      }),
      trainImageClassificationModel: builder.mutation({
        query(data) {
          return {
            url: 'train_image_classification_model',
            method: 'POST',
            body: data
          }
        },
      }),
      getRunLogs: builder.mutation({
        query(data) {
          return {
            url: 'get-run-logs',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setRunLosgList(data.run_history));
          } catch (error) {}
        },
      }),
      getTrainingViewDetail: builder.mutation({
        query(data) {
          return {
            url: 'get_detailed_training_history',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setTrainingViewDetail(data.run_history));
          } catch (error) {}
        },
      }),
      getDataSetInfo: builder.mutation({
        query(data) {
          return {
            url: 'get-dataset-info',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setDatasetInfo(data.data_info));
          } catch (error) {}
        },
      }),
      getViewSample: builder.mutation({
        query(data) {
          return {
            url: 'get-dataset-info',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setViewSample(data.sample_paths));
          } catch (error) {}
        },
      }),
    }),
});

export const {
  useGetProjectListMutation,
  useCreateProjectMutation,
  useGetDataSetListMutation,
  useUploadDataMutation,
  useUpdateLatestUrlMutation,
  useTrainImageClassificationModelMutation,
  useGetRunLogsMutation,
  useGetTrainingViewDetailMutation,
  useGetDataSetInfoMutation,
  useGetViewSampleMutation
} = baseApi;
