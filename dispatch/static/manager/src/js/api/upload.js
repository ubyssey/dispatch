export function putFile(url, contentType, file) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo')

    var xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)

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
