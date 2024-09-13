import { toast } from 'react-toastify'

export const isEmpty = value => {
  if (value == undefined) return 1
  if (value == null) return 1
}

export const getErrorMsg = error => {
  if (isEmpty(error?.data?.message)) return 'Something went wrong'

  return error.data.message
}

export const handleErrorResponse = (error, url = '', router = null) => {
  if (Array.isArray(error?.data?.error)) {
    error.data.error.forEach(el =>
      toast.error(el.message, {
        position: 'top-right'
      })
    )
  } else {
    toast.error(getErrorMsg(error), {
      position: 'top-right'
    })
  }
  if (url != '') router.push(url)
}

export const trimedStr = (str, num) => {
  if (str?.length < num) return str
  if (typeof str == 'string') {
    const subStr = str.substring(0, str.length - num)

    return subStr
  }

  return str
}

export const removeUuid = str => {}

export const getFileExtension = filename => {
  return filename.split('.').pop()
}

export const captureVideoFrame = (video, format, quality) => {
  if (typeof video === 'string') {
    video = document.getElementById(video)
  }

  format = format || 'jpeg'
  quality = quality || 0.92

  if (!video || (format !== 'png' && format !== 'jpeg')) {
    return false
  }

  var canvas = document.createElement('CANVAS')

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  canvas.getContext('2d').drawImage(video, 0, 0)

  var dataUri = canvas.toDataURL('image/' + format, quality)
  var data = dataUri.split(',')[1]
  var mimeType = dataUri.split(';')[0].slice(5)

  var bytes = window.atob(data)
  var buf = new ArrayBuffer(bytes.length)
  var arr = new Uint8Array(buf)

  for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i)
  }

  var blob = new Blob([arr], { type: mimeType })

  return { blob: blob, dataUri: dataUri, format: format }
}
