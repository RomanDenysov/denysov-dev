import { track } from "@vercel/analytics"

const ENGAGED_AFTER_MS = 15_000
const PREVIEW_DWELL_MS = 700

// Named clicks: links, projects, contact
document.addEventListener("click", (event) => {
  const el = (event.target as HTMLElement).closest("[data-event]")
  const name = el?.getAttribute("data-event")
  if (name) track(name)
})

// Visitor stayed with the tab visible for 15s: separates real reads from bounces
let visibleMs = 0
let visibleSince = 0
let engagedTimer: number | undefined
let engaged = false

function startVisible() {
  visibleSince = performance.now()
  engagedTimer = window.setTimeout(() => {
    engaged = true
    track("engaged_visit")
  }, ENGAGED_AFTER_MS - visibleMs)
}

if (document.visibilityState === "visible") startVisible()
document.addEventListener("visibilitychange", () => {
  if (engaged) return
  if (document.visibilityState === "visible") {
    startVisible()
  } else {
    visibleMs += performance.now() - visibleSince
    window.clearTimeout(engagedTimer)
  }
})

// Work list scrolled into view
const workSection = document.querySelector("[data-section='work']")
if (workSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      track("work_section_viewed")
      observer.disconnect()
    },
    { threshold: 0.3 },
  )
  observer.observe(workSection)
}

// Hovered a project long enough to see its preview (once per project)
const previewed = new Set<string>()
document.querySelectorAll<HTMLElement>("[data-work]").forEach((item) => {
  let timer: number | undefined
  item.addEventListener("mouseenter", () => {
    const project = item.dataset.work
    if (!project || previewed.has(project)) return
    timer = window.setTimeout(() => {
      previewed.add(project)
      track("work_preview", { project })
    }, PREVIEW_DWELL_MS)
  })
  item.addEventListener("mouseleave", () => window.clearTimeout(timer))
})

// Email copied instead of clicked (mailto often does nothing on desktop)
document.addEventListener("copy", () => {
  if (window.getSelection()?.toString().includes("@denysov.dev")) track("email_copied")
})
