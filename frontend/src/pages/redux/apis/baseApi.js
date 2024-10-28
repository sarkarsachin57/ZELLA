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
  setViewSample,
  setSimpleImageUrl,
  setNoiseHistory,
  setModelEvaluationLogs,
  setSplitDataset
} from '../features/baseSlice';

/**
 * 👇 @file handles the auth apis
 */


export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: customFetchBase,
    endpoints: (builder)=>({
/**
 * 👇 @file handles project api
 */
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
/**
 * 👇 @file handles upload dataset api
 */
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
      getDataSetInfo: builder.mutation({
        query(data) {
          return {
            url: 'get-image-classification-dataset-info',
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
      getObjectDataSetInfo: builder.mutation({
        query(data) {
          return {
            url: 'get-object-detection-dataset-info',
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
      getSemanticDataSetInfo: builder.mutation({
        query(data) {
          return {
            url: 'get-semantic-segmentation-dataset-info',
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
      getInstanceDataSetInfo: builder.mutation({
        query(data) {
          return {
            url: 'get-instance-segmentation-dataset-info',
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
            url: 'get-image-classification-dataset-info',
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
      getObjectViewSample: builder.mutation({
        query(data) {
          return {
            url: 'get-object-detection-dataset-info',
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
      getsemanticViewSample: builder.mutation({
        query(data) {
          return {
            url: 'get-object-detection-dataset-info',
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
      getSimpleImageUrl: builder.mutation({
        query(data) {
          return {
            url: 'get_single_sample_visualization',
            method: 'POST',
            body: data
          }
        },
        transformResponse: result => result,
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setSimpleImageUrl(data.show_path));
          } catch (error) {}
        },
      }),
/**
 * 👇 @file handles url
 */
      updateLatestUrl: builder.mutation({
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            dispatch(updateLatestProjectUrl(args))
          } catch(error) {
            throw new error;
          }
        }
      }),
/**
 * 👇 @file handles model training api
 */
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
      trainObjectDetectionModel: builder.mutation({
        query(data) {
          return {
            url: 'train_object_detection_model',
            method: 'POST',
            body: data
          }
        },
      }),
      trainSemanticSegmentationModel: builder.mutation({
        query(data) {
          return {
            url: 'train_semantic_segmentation_model',
            method: 'POST',
            body: data
          }
        },
      }),
      trainInstanceSegmentationModel: builder.mutation({
        query(data) {
          return {
            url: 'train_instance_segmentation_model',
            method: 'POST',
            body: data
          }
        },
      }),
/**
  * 👇 @file Model noise Filtering
*/
    filterNoiseSamples: builder.mutation({
      query(data) {
        return {
          url: 'filter_noisy_samples',
          method: 'POST',
          body: data
        }
      },
    }),
    getNoiseRunFilteringLogs: builder.mutation({
      query(data) {
        return {
          url: 'get_noise_filtering_logs',
          method: 'POST',
          body: data
        }
      },
      transformResponse: result => result,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setNoiseHistory(data.run_history));
        } catch (error) {}
      },
    }),
/**
  * 👇 @file Model Evaluation
*/
    modelEvaluation: builder.mutation({
      query(data) {
        return {
          url: 'model_evaluation',
          method: 'POST',
          body: data
        }
      },
      transformResponse: result => result,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setModelEvaluationLogs(data.run_history));
        } catch (error) {}
      },
    }),
    GetEvalRunLogs: builder.mutation({
      query(data) {
        return {
          url: 'get-eval-run-logs',
          method: 'POST',
          body: data
        }
      },
      transformResponse: result => result,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setModelEvaluationLogs(data.run_history));
        } catch (error) {}
      },
    }),
/**
  * 👇 @file Model Inference
*/
    modelInference: builder.mutation({
      query(data) {
        return {
          url: 'model_inference',
          method: 'POST',
          body: data
        }
      },
    }),
/**
  * 👇 @file Model Split
*/
    SplitDataset: builder.mutation({
      query(data) {
        return {
          url: 'split_dataset',
          method: 'POST',
          body: data
        }
      },
      transformResponse: result => result,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSplitDataset(data.run_history));
        } catch (error) {}
      },
    }),
    getSplitDataset: builder.mutation({
      query(data) {
        return {
          url: 'get_data_split_logs',
          method: 'POST',
          body: data
        }
      },
      transformResponse: result => result,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSplitDataset(data.run_history));
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
  useGetObjectDataSetInfoMutation,
  useGetSemanticDataSetInfoMutation,
  useGetInstanceDataSetInfoMutation,
  useGetViewSampleMutation,
  useGetObjectViewSampleMutation,
  useGetsemanticViewSampleMutation,
  useTrainObjectDetectionModelMutation,
  useTrainSemanticSegmentationModelMutation,
  useTrainInstanceSegmentationModelMutation,
  useGetSimpleImageUrlMutation,

  useFilterNoiseSamplesMutation,
  useGetNoiseRunFilteringLogsMutation,

  useModelEvaluationMutation,
  useGetEvalRunLogsMutation,

  useModelInferenceMutation,

  useSplitDatasetMutation,
  useGetSplitDatasetMutation
} = baseApi;
