function RunMetadata() {
  const docs = document.querySelectorAll('[data-form="metadata-output"] [name]')
  const metadataHTML = document.getElementById("metadata-html")
  const metadataNEXTJS = document.getElementById("metadata-nextjs")

  const getAllHtml = () => {
    let dataMAP = new Map()
    let dockedMap = new Map()
    docs.forEach((a, i) => {
      const name = a.getAttribute("name")
      if(name.match("formatDetection")) {
        return dockedMap.set(
          name.replace("formatDetection.",""),
          a.checked? "yes":"no"
        )
      }
      dataMAP.set(name, a.value||"")
      if(["title","description"].indexOf(name) != -1) {
        dataMAP.set(`og:${name}`, a.value||"")
      }
    })
    let toStringDocked = []
    const dockedMapLS = Object.fromEntries(dockedMap)
    Object.keys(dockedMapLS).forEach(c => {
      toStringDocked.push(`${c}=${dockedMapLS[c]}`)
    })
    dataMAP.set("og:site-name", dataMAP.get("title"))
    dataMAP.set("og:locale", "id_ID")
    dataMAP.set("og:type", "website")
    dataMAP.set("formatDetection", toStringDocked.join(", "))
    return Object.fromEntries(dataMAP)
  }

  const applyDoc = () => {
    const mapHtml = getAllHtml()
    let htmlInd = ""
    Object.keys(mapHtml).forEach(a => {
      if(a == "title") {
        return htmlInd += `<title>${mapHtml[a]}</title>\n`
      }
      if(a.match("og:")) {
        return htmlInd += `<meta property="${a}" content="${mapHtml[a]}">\n`
      }
      htmlInd += `<meta name="${a}" content="${mapHtml[a]}">\n`
    })
    metadataHTML.innerText = htmlInd
  }

  docs.forEach((doc, i) => {
    doc.addEventListener("input", () => {
      applyDoc()
    })
  })
  applyDoc()
}
RunMetadata()