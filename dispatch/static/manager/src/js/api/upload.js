export function putFile(url, contentType, file, progressCallback) {

  const updateProgress = (e) => {
    if (e.lengthComputable) {
      const percentComplete = e.loaded / e.total

      if (typeof progressCallback === 'function') {
        progressCallback(percentComplete)
      }
    }
  }

  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', updateProgress)

    xhr.open('PUT', url, true)

    progressCallback(0)

    xhr.setRequestHeader('Content-Type', contentType)
    xhr.send(file)

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve()
      } else {
        reject()
      }
    }

    xhr.onerror = () => {
      reject()
    }

  })
}
