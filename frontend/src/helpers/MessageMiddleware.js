import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux'

// ** Hook Import
import { useMessagesMutation, useCheck_streamMutation } from 'src/pages/redux/apis/edfsdf'
import {
  useCreateLogMutation,
  useCreateManyLogsMutation,
  useCreateDetectionLogMutation,
  useCreateManyDetectionLogsMutation
} from 'src/pages/redux/apis/logApi'
import {
  useTerminate_cameraMutation,
  useGet_offline_progressMutation,
  useGet_offline_logsMutation
} from 'src/pages/redux/apis/edfsdf'

import { useUpdateConfigMutation } from 'src/pages/redux/apis/configApi'
import { updateConfig as updateStateConfig } from 'src/pages/redux/features/configSlice'

import { toast } from 'react-toastify'

import { compareArrays } from 'src/@core/helpers/utils'
import { TRUST_MODE, TRUST_METHOD } from 'src/constants'

const calcSeconds = timeStr => {
  if (timeStr.length === 0) {
    return 0
  }
  const timeArr = timeStr.split(':')
  const hours = parseInt(timeArr[0])
  const mins = parseInt(timeArr[1])
  const secs = parseInt(timeArr[2])

  return hours * 3600 + mins * 60 + secs
}

/**
 * @author QmQ
 * @function handles all the message stream from flask api
 *
 */

let msgFlagList = []

const MessageMiddleware = ({ children }) => {
  const [cookies] = useCookies(['logged_in'])

  // let msgFlagList = [];
  let willLogMsgList = []
  let message_type = ''
  let target_id = ''
  let message_content = ''

  const dispatch = useDispatch()

  const configs = useSelector(state => {
    return state.configState.configs
  })

  const user = useSelector(state => {
    return state.userState.user
  })

  const { modeType, methodType } = useSelector(state => state.siteSettingState)

  const [conns, setConns] = useState(configs)
  const [myUser, setMyUser] = useState(user)
  const [exceptionHandleFlag, setExceptionHandleFlag] = useState(false)
  const [messages, { isLoading, isError }] = useMessagesMutation()
  const [check_stream, { isLoading: isLoading_check_stream }] = useCheck_streamMutation()
  const [terminate_camera, { isLoading: term_isLoading }] = useTerminate_cameraMutation()
  const [createLog] = useCreateLogMutation()
  const [createManyLogs] = useCreateManyLogsMutation()
  const [createDetectionLog] = useCreateDetectionLogMutation()
  const [createManyDetectionLogs] = useCreateManyDetectionLogsMutation()
  const [get_offline_progress] = useGet_offline_progressMutation()
  const [get_offline_logs] = useGet_offline_logsMutation()
  const [updateConfig] = useUpdateConfigMutation()

  const handleException = async conn => {
    const res = await check_stream(conn)
    if (res?.data?.status == 'fail') {
      await terminate_camera(conn)
    }
  }

  /**
   * @function checks the configurations and send the message request to flask api from every camera with status 1
   */

  const check_online_messages = async () => {
    const onlineConns = conns.filter(conn => conn.method === TRUST_METHOD.tracking && conn.mode == TRUST_MODE.online)

    var i = 0
    for (const conn of onlineConns) {
      i++

      // console.time('Nice way');
      if ((conn.tracking_mode == 'sot' && conn.status == 1) || conn.tracking_mode == 'mot') {
        const res = await messages(conn)
        if (res?.error?.name == 'AbortError') {
          // console.log("abort error===========>", res.error.message, exceptionHandleFlag)
          // if(exceptionHandleFlag == false) {
          //   setExceptionHandleFlag(true);
          //   await handleException(conn)
          //   setExceptionHandleFlag(false)
          // }
        }

        if (res && res.data) {
          if (res?.data?.status == 'fail') {
            // console.log("fail response ===========>", res.data?.message, exceptionHandleFlag)
            // if(exceptionHandleFlag == false) {
            //   setExceptionHandleFlag(true);
            //   await handleException(conn)
            //   setExceptionHandleFlag(false)
            // }
          } else {
            handle_online_message(res.data, conn)
          }
        }
      }

      // console.timeEnd('Nice way');
    }
  }

  const check_offline_messages = async () => {
    var i = 0

    const offline_active_conns = conns.filter(
      conn => conn.method === TRUST_METHOD.tracking && conn.mode == 'offline' && conn.active == 1
    )

    for (const conn of offline_active_conns) {
      i++

      // console.time('Nice way');

      const res = await get_offline_progress(conn)
      if (res?.error?.name == 'AbortError') {
      }

      if (res && res.data) {
        if (res?.data?.status == 'success') {
          if (res.data.progress == 100) {
            updateConfig({
              id: conn._id,
              update: {
                active: 2
              }
            })
            const logs_res = await get_offline_logs(conn)

            if (logs_res.data.status == 'success') handle_offline_message(logs_res.data.data, conn)
          } else {
            dispatch(
              updateStateConfig({
                _id: conn._id,
                progress: res.data?.progress,
                estimateTime: res.data?.est_time
              })
            )
          }
        } else {
        }
      }

      // console.timeEnd('Nice way');
    }
  }

  const check_detection_online_messages = async () => {
    const onlineConns = conns.filter(conn => conn.method === TRUST_METHOD.detection && conn.mode == TRUST_MODE.online)

    for (const conn of onlineConns) {
      // console.time('Nice way');

      const res = await messages(conn)
      if (res?.error?.name == 'AbortError') {
      }

      if (res && res.data) {
        if (res?.data?.status == 'fail') {
        } else {
          handle_detection_online_message(res.data, conn)
        }
      }

      // console.timeEnd('Nice way');
    }
  }

  const check_detection_offline_messages = async () => {
    const offlineConns = conns.filter(
      conn => conn.method === TRUST_METHOD.detection && conn.mode == TRUST_MODE.offline && conn.active == 1
    )

    for (const conn of offlineConns) {
      // console.time('Nice way');
      const res = await get_offline_progress(conn)

      if (res?.error?.name == 'AbortError') {
      }

      if (res && res.data) {
        if (res?.data?.status == 'success') {
          if (res.data.progress == 100) {
            updateConfig({ id: conn._id, update: { active: 2 } })
            const logs_res = await get_offline_logs(conn)
            if (logs_res.data.status == 'success') {
              handle_detection_offline_message(logs_res.data.data, conn)
            }
          } else {
            dispatch(
              updateStateConfig({
                _id: conn._id,
                progress: res.data?.progress,
                estimateTime: res.data?.est_time
              })
            )
          }
        }
      }

      // console.timeEnd('Nice way');
    }
  }

  const check_messages = () => {
    if (conns?.length == 0) return
    if (cookies.logged_in == false) return
    if (methodType === TRUST_METHOD.tracking && modeType === TRUST_MODE.online) check_online_messages()
    if (methodType === TRUST_METHOD.tracking && modeType === TRUST_MODE.offline) check_offline_messages()
    if (methodType === TRUST_METHOD.detection && modeType === TRUST_MODE.online) check_detection_online_messages()
    if (methodType === TRUST_METHOD.detection && modeType === TRUST_MODE.offline) check_detection_offline_messages()

    return
  }

  const handle_offline_message = async (data, conn) => {
    willLogMsgList = []
    let res = {}
    let msg = {}
    const _timestamp = new Date().getTime()
    const timestamp = Math.floor(_timestamp / 1000)
    for (let ind = 0; ind < data.length; ind++) {
      res = data[ind]

      for (let i = 0; i < res.messages.length; i++) {
        msg = res.messages[i]
        message_type = msg.msg_type
        target_id = msg.target_id
        message_content = msg.message

        if (['message', 'warning', 'alert'].includes(message_type)) {
          if (res.tracking_mode == 'sot') {
            willLogMsgList.push({
              camera_name: conn.camera_name,
              tracking_mode: conn.tracking_mode,
              content: message_content,
              msg_type: message_type,
              msg_time: res.time,
              target_id: target_id,
              target_file_path: msg.target_file_path,
              target_file_name: msg.target_file_name,
              mode: 'offline',
              duration: calcSeconds(res.time),
              _timestamp: _timestamp,
              timestamp: timestamp
            })
          } else {
            willLogMsgList.push({
              camera_name: conn.camera_name,
              tracking_mode: conn.tracking_mode,
              content: message_content,
              msg_type: message_type,
              msg_time: res.time,
              target_id: target_id,
              target_file_path: msg.target_file_path,
              target_file_name: msg.target_file_name,
              mode: 'offline',
              duration: calcSeconds(res.time),
              _timestamp: _timestamp,
              timestamp: timestamp
            })
          }
        } else {
          console.log('message exception=====>', msg)
        }
      }
    }

    if (willLogMsgList != [] || willLogMsgList != undefined) createManyLogs(willLogMsgList)
  }

  // handle the messages based on its response status "message" | "warning" | "alert" **QmQ
  const handle_online_message = (res, conn) => {
    if (cookies.logged_in == false || res.messages == [] || res.messages == undefined) return

    let msg = {}
    willLogMsgList = []
    const _timestamp = new Date().getTime()
    const timestamp = Math.floor(_timestamp / 1000)

    for (let i = 0; i < res.messages.length; i++) {
      msg = res.messages[i]
      message_type = msg.msg_type
      target_id = msg.target_id
      message_content = msg.message
      msgFlagList[conn.camera_name] = msgFlagList[conn.camera_name] ?? {}
      if (msgFlagList[conn.camera_name][target_id] != message_content) {
        msgFlagList[conn.camera_name][target_id] = message_content
        if (['message', 'warning', 'alert'].includes(message_type)) {
          // print the log ** QmQ
          // createLog({content: res.message, camera_name: conn.camera_name});
          // handle the audio ** QmQ
          if (user?.audio) {
            const toast_sound = new Audio('/audios/toast_sound.mp3')
            toast_sound.play()
          }

          // handle the visual part ** QmQ
          if (user?.visual == true) {
            message_type == 'message'
              ? toast.success(message_content)
              : message_type == 'warning'
              ? toast.warning(message_content)
              : toast.error(message_content)
          }
          if (res.tracking_mode == 'sot') {
            willLogMsgList.push({
              camera_name: conn.camera_name,
              tracking_mode: conn.tracking_mode,
              content: message_content,
              msg_type: message_type,
              msg_time: res.time,
              target_id: target_id,
              target_file_path: msg.target_file_path,
              target_file_name: msg.target_file_name,
              _timestamp: _timestamp,
              timestamp: timestamp
            })
          } else {
            willLogMsgList.push({
              camera_name: conn.camera_name,
              tracking_mode: conn.tracking_mode,
              content: message_content,
              msg_type: message_type,
              msg_time: res.time,
              target_id: target_id,
              target_file_path: msg.target_file_path,
              target_file_name: msg.target_file_name,
              _timestamp: _timestamp,
              timestamp: timestamp
            })
          }
        } else {
          console.log('message exception=====>', res)
        }
      }
    }

    if (willLogMsgList != [] || willLogMsgList != undefined) createManyLogs(willLogMsgList)
  }

  const handle_detection_offline_message = async (data, conn) => {
    willLogMsgList = []
    let res = {}
    const _timestamp = new Date().getTime()
    const timestamp = Math.floor(_timestamp / 1000)

    for (let ind = 0; ind < data.length; ind++) {
      res = data[ind]
      willLogMsgList.push({
        media_name: res.vid_name,
        mode: conn.mode,
        time: res.time,
        duration: calcSeconds(res.time),
        n_fp: res.n_fp,
        n_fn: res.n_fn,
        classwise_fp: res.classwise_fp ? res.classwise_fp : 'empty',
        classwise_fn: res.classwise_fn ? res.classwise_fn : 'empty',
        use_case: res.use_case,
        error_frame_path: res.error_frame_path,
        _timestamp: _timestamp,
        timestamp: timestamp
      })
    }

    if (willLogMsgList != [] || willLogMsgList != undefined) createManyDetectionLogs(willLogMsgList)
  }

  const handle_detection_online_message = async (data, conn) => {
    willLogMsgList = []
    const _timestamp = new Date().getTime()
    const timestamp = Math.floor(_timestamp / 1000)
    willLogMsgList.push({
      media_name: data.cam_name,
      mode: conn.mode,
      frame_no: data.frame_no,
      capture_time: data.datetime,
      n_fp: data.n_fp,
      n_fn: data.n_fn,
      classwise_fp: data.classwise_fp,
      classswise_fn: data.classwise_fn,
      use_case: data.use_case,
      error_frame_path: data.error_frame_path,
      _timestamp: _timestamp,
      timestamp: timestamp
    })
    if (willLogMsgList != [] || willLogMsgList != undefined) createManyDetectionLogs(willLogMsgList)
  }

  var timers = []

  useEffect(() => {
    for (var i = 0; i < timers.length; i++) {
      clearInterval(timers[i])
    }
    timers.push(
      setInterval(() => {
        check_messages()
      }, 500)
    )

    return () => {
      for (var i = 0; i < timers.length; i++) {
        clearInterval(timers[i])
      }
    }
  }, [configs, conns, modeType, methodType])

  useEffect(() => {
    setConns(configs)
  }, [configs])

  return children
}

export default MessageMiddleware
