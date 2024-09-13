import { useState } from 'react'

import {v4 as uuid} from 'uuid'
import { toast } from 'react-toastify'

// library components
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip'

// custom components
import CustomModalLayout from './CustomModalLayout'

import FileInput from 'src/views/commons/FileInput'
import { CustomButton } from 'src/@core/components/button/CustomButton'

// state managements 
import {
    useCreateConfigMutation} from 'src/pages/redux/apis/configApi'
import { useCreateLogMutation } from 'src/pages/redux/apis/logApi'
import {
    useAddDetectionCameraMutation,
    uploadChunkedFile
} from 'src/pages/redux/apis/streamApi';
import { TRUST_MODE, TRUST_METHOD } from 'src/constants'

const defaultConfigData = {
    cameraPath: '',
    cameraName: '',
    classesFile: undefined,
    modelList: [],
    useCase: ''
}

export default function CameraSettingModal(props) {
    const {
        width,
        height,
        onHandleSubmit,
        onHandleModalClose,
        onHandleModalOpen,
        isOpen,
        isLoading = false,
    } = props

    const [createConfig, {}] = useCreateConfigMutation();
    const [createLog, {}] = useCreateLogMutation();
    
    const [addDetectionCamera, {isLoading: isAddLoading, isError, error, isSuccess}] = useAddDetectionCameraMutation();
  
    console.log('status============================>')
    console.log(isAddLoading, isError, error, isSuccess)
    const [configData, setConfigData] = useState(defaultConfigData)

    const [newModelFile, setNewModelFile] = useState(undefined);
    const [newModelFamily, setNewModelFamily] = useState('')
    const [newModelName, setNewModelName] = useState('')
    const [addModelLoading, setAddModelLoading] = useState(false)

    const handleClassesFileOnChange = (data) => {
        setConfigData({ ...configData, classesFile: data.file})
    }

    const handleNewModelFileOnChange = (data) => {
        console.log('new model data============>', data, data.file)
        
        setNewModelName(data.file.name);
        setNewModelFile(data.file)
    }

    const handleAddModel = async (e) => {
        setAddModelLoading(true);
        e.preventDefault();
        const _uuid = uuid();
        const sliced8_uuid = _uuid.slice(0,8)
        try {
            const res = await uploadChunkedFile({
                file: newModelFile, 
                mode: TRUST_MODE.online,
                uuidedName: sliced8_uuid
            })
             console.log('configData.modelList ====> ', configData.modelList)
            // if (configData.modelList.find((el) => el.modelName === newModelFile.name)) {
            if (res.status === 200 && res.data.status === 'Completed') {
                let _modelList = [...configData.modelList];
                
                _modelList.push({model_id: sliced8_uuid, model_family: newModelFamily, model_name: newModelName, model_path: res.data.model_path});
                // [...(configData.modelList), {id: _uuid, modelName: newModelName, modelFile: newModelFile}]
                setConfigData({
                    ...configData,
                    modelList: _modelList
                })
            }
            setAddModelLoading(false)   
        } catch (error) {
            setAddModelLoading(false)   
        }
    }

    const handleModelDelete = (model) => {
        let _modelList = configData.modelList.filter((_model)  => _model.id !== model.id);
        setConfigData({...configData, modelList: _modelList});
    }

    const validateData = () => {
        if (!(configData.cameraName && configData.cameraPath && configData.classesFile && configData.modelList.length)) {
            toast.error('Please Fill out all the forms', {
                position: 'top-right'
            })
            return false
        }
        return true
    }

    const clearSettingData = () => {
        setConfigData(defaultConfigData)
        setNewModelFile(undefined)
        setNewModelFamily('')
        setNewModelName('')
    }

    const handleSubmitWithData = async (e) => {
        if (!validateData()) return;
        e.preventDefault();

        const formData = new FormData()
        formData.append('cam_name', configData.cameraName)
        formData.append('cam_path', configData.cameraPath)
        formData.append('classes', configData.classesFile)
        formData.append('model_metas', JSON.stringify(configData.modelList))
        formData.append('use_case', configData.useCase)
  
        
        const res = await addDetectionCamera(formData, configData.cameraName);
        console.log('======> add detection camera response ====>', res)
        if (res.error) {

        } else {
            // ==== create a detection video configuration ===
            const _config = {
                camera_name: configData.cameraName,
                video_path: res.data?.data?.cam_path.toString() ?? '0',
                video_path_detect: '0',
                video_path_correct: '0',
                mode: TRUST_MODE.online,
                tracking_mode: 'sot', // this field is meaningless for this config **QmQ
                method: TRUST_METHOD.detection,
                active: 1,
                useCase: configData.useCase,
            }
            await createConfig(_config);

            // === create the video processing started log ===
            const _timestamp = new Date().getTime();
            const timestamp = Math.floor(new Date().getTime()/1000);
            await createLog({
                content: `${configData.cameraName} - Video started processing`, 
                camera_name: configData.cameraName,
                mode: TRUST_MODE.online,
                method: TRUST_METHOD.detection,
                _timestamp: _timestamp,
                timestamp: timestamp,
                use_case: configData.useCase
            })
            toast.success(res.data?.message)
          
            clearSettingData();
            onHandleModalClose();
        }

    }

  return (
    <CustomModalLayout
      width = {width}
      height = {height}
      isOpen={isOpen}
      isLoading={isAddLoading}
      title={'Add New Camera'}
      btnName={'Done'}
      onHandleModalClose={onHandleModalClose}
      onHandleModalOpen={onHandleModalOpen}
      onHandleSubmit={handleSubmitWithData}
    >
      <DialogContent>

        <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    type='text'
                    label='Camera Name'
                    placeholder='Please input Camera Name'
                    value={configData.cameraName}
                    onChange={e => {
                        setConfigData({...configData, cameraName: e.target.value})
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    type='text'
                    label='Camera Path'
                    placeholder='Please input Camera Path'
                    value={configData.cameraPath}
                    onChange={e => {
                        setConfigData({...configData, cameraPath: e.target.value})
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FileInput label="Upload Classes Meta" video_file={configData.classesFile} onChange={ handleClassesFileOnChange }/>
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField label="Input Use Case" onChange={ e => {
                    setConfigData({ ...configData, useCase: e.target.value })
                }}/>
            </Grid>
            
            <Grid item xs={12} sm={4} sx={{textAlign: 'left'}}>
                <FormControl fullWidth >
                    <InputLabel id="model_family"> {"Model Family"} </InputLabel>
                    <Select
                        onChange={ (e) => setNewModelFamily(e.target.value) }
                        id='model_family'
                        labelId='model_family'
                        value={newModelFamily}
                        input={<OutlinedInput label='Tracking Mode' id='Tracking Mode' />}
                    >
                        <MenuItem value={"yolov7"}> {"YOLOV7"} </MenuItem>
                        <MenuItem value={"yolov6"}> {"YOLOV6"} </MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
                <FileInput label="Upload Model" video_file={newModelFile} onChange={ handleNewModelFileOnChange }/>
            </Grid>
            
            <Grid item xs={12} sm={3} sx={{margin: 'auto'}}>
                <CustomButton
                    variant='contained'
                    sx={{ mt: 1 }}
                    disableElevation
                    onClick={ handleAddModel }
                    loading={addModelLoading}
                >
                    {`ADD`}
                </CustomButton>
            </Grid>
            <Grid item xs={12} sm={12} sx={{margin: 'auto'}}>
                {
                    configData.modelList && configData.modelList.map((_model) => {
                        return (
                            <Chip
                                label={_model.model_name}
                                key={_model.model_id}
                                // onClick={handleClick}
                                onDelete={() => handleModelDelete(_model)}
                                deleteIcon={<DeleteIcon />}
                                variant="outlined"
                        />
                        )
                    })
                }
            </Grid>
        </Grid>
      </DialogContent>
    </CustomModalLayout>
  )
}
