function RunGenIcon() {
  const btnFile = document.querySelector('#file-manage')
  const iconManage = [
    "16x16","32x32","64x64","128x128","256x256","512x512"
  ]

  async function FileData(fileinput, file) {
    if(!file) {
      return alert('Error!')
    }
    const mainFile = await ReadDocsImage(file.files[0])
    console.log(mainFile)
    if(mainFile.error) {
      return alert(mainFile.error.message)
    }
    if(mainFile.width != mainFile.height) {
      return alert('Images do not have 1:1 dimensions!')
    }
    if(mainFile.width < 512) {
      return alert('Minimum image resolution is 512px x 512px!')
    }
    try {
      let listFile = []
      for(let imageSize of iconManage) {
        listFile.push((await ResizeImage(
          mainFile.uri, imageSize.split("x")[0], imageSize.split("x")[1]
        )))
      }
      const zip = new JSZip()
      listFile.forEach(a => {
        const splitType = a.url.split(";")[0].split(":")[1].split("/")[1]
        zip.file(`${a.size}-icon.${splitType}`, a.url.split(",")[1], { base64: true })
      })
      zip.generateAsync({type:"blob"})
      .then(a => {
        const btn = document.querySelector('#zipdownload')
        btn.setAttribute("href", URL.createObjectURL(a))
        btn.style.display = "flex"
      })
    } catch(err) {
      return alert(err.stack)
    }
  }

  async function ReadDocsImage(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    return new Promise((res) => {
      reader.onload = () => {
        const urlImg = reader.result
        const image = new Image()
        image.src = urlImg
        image.onload = () => {
          return res({
            uri: urlImg,
            width: image.width,
            height: image.height,
            cala: `${image.width}x${image.height}`
          })
        }
        image.onerror = (err) => {
          return res({ error: err })
        }
      }
      reader.onerror = (err) => {
        return res({ error: err })
      }
    })
  }

  async function ResizeImage(url, width, height) {
    return new Promise((res, err) => {
      const canvas = document.createElement("canvas")
      canvas.width = `${width}`
      canvas.height = `${height}`
      const context = canvas.getContext("2d")
      const image = new Image(canvas.width, canvas.height)
      image.src = url
      image.onload = async () => {
        context.drawImage(image, 0, 0, Number(width), Number(height))
        await new Promise((a) => setTimeout(a, 200))
        return res({
          url: canvas.toDataURL("image/png"),
          size: Number(width),
        })
      }
      image.onerror = (error) => {
        return err(error)
      }
    })
  }

  btnFile.addEventListener("click", () => {
    const file = document.createElement("input")
    file.type = "file"
    file.accept = "image/png, image/gif, image/jpeg"
    file.click()
    file.addEventListener("change",(e) => {
      FileData(e, file)
      file.removeEventListener("change",FileData)
    })
    
  })
}
RunGenIcon()