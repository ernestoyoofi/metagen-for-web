const dsl = document.querySelector('md-tabs')
const enableSw = ["metadata","manifest","genicon"]

function ChangeTab(i) {
  document.querySelectorAll(`.form-group`).forEach((a) => {
    a.style.display = "none"
  })
  const nameNav = `.group-${enableSw[i]}`
  document.querySelector(nameNav).style.display = "flex"
  history.pushState(null, null, `${location.origin}${location.pathname}?${new URLSearchParams({
    page: String(i)
  }).toString()}`)
}

function ApplyURL() {
  const ur = new URL(location.href)
  const search = new URLSearchParams(ur.search)
  const indx = isNaN(search.get("page"))? 0 : Number(search.get("page"))
  if(indx < enableSw.length) {
    ChangeTab(indx)
    dsl.activeTabIndex = indx 
  }
}
ApplyURL()

dsl.addEventListener("change", () => {
  ChangeTab(dsl.activeTabIndex)
})