const OPEN_DELAY_MS = 200
const CLOSE_DELAY_MS = 100
const ANIMATION_MS = 200
const WARM_CLEAR_MS = 300
const SIDE_OFFSET_PX = 8

const canHover = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

let isWarm = false
let warmClearTimer: ReturnType<typeof setTimeout> | undefined

function markWarm() {
  isWarm = true
  clearTimeout(warmClearTimer)
}

function scheduleWarmClear() {
  clearTimeout(warmClearTimer)
  warmClearTimer = setTimeout(() => {
    isWarm = false
  }, WARM_CLEAR_MS)
}

function shouldAnimateInstantly() {
  return isWarm || prefersReducedMotion()
}

function positionPopup(trigger: HTMLElement, popup: HTMLElement) {
  const rect = trigger.getBoundingClientRect()
  popup.style.left = `${rect.left + rect.width / 2}px`
  popup.style.top = `${rect.top - SIDE_OFFSET_PX}px`
  popup.style.transform = "translate(-50%, -100%)"
}

function isOpen(popup: HTMLElement) {
  return popup.hasAttribute("data-open")
}

function initPreview(root: HTMLElement) {
  const trigger = root.querySelector<HTMLElement>("[data-work-preview-trigger]")
  const popup = root.querySelector<HTMLElement>("[data-work-preview-popup]")
  const panel = popup?.querySelector<HTMLElement>(".work-item-preview-panel")
  if (!trigger || !popup || !panel) return

  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  let closeAnimationTimer: ReturnType<typeof setTimeout> | undefined

  const finishClose = () => {
    popup.removeAttribute("data-open")
    popup.removeAttribute("data-instant")
    popup.setAttribute("hidden", "")
    popup.setAttribute("aria-hidden", "true")
    popup.classList.remove("pointer-events-auto")
    scheduleWarmClear()
  }

  const show = () => {
    clearTimeout(closeTimer)
    clearTimeout(closeAnimationTimer)

    const delay = shouldAnimateInstantly() ? 0 : OPEN_DELAY_MS

    openTimer = setTimeout(() => {
      positionPopup(trigger, popup)
      popup.removeAttribute("hidden")
      popup.setAttribute("aria-hidden", "false")

      if (shouldAnimateInstantly()) {
        popup.setAttribute("data-instant", "")
      } else {
        popup.removeAttribute("data-instant")
      }

      requestAnimationFrame(() => {
        popup.setAttribute("data-open", "")
        popup.classList.add("pointer-events-auto")
        markWarm()
      })
    }, delay)
  }

  const hide = () => {
    clearTimeout(openTimer)

    const delay = shouldAnimateInstantly() ? 0 : CLOSE_DELAY_MS

    closeTimer = setTimeout(() => {
      if (!isOpen(popup)) return

      if (shouldAnimateInstantly()) {
        popup.setAttribute("data-instant", "")
        popup.removeAttribute("data-open")
        finishClose()
        return
      }

      popup.removeAttribute("data-instant")
      popup.removeAttribute("data-open")
      closeAnimationTimer = setTimeout(finishClose, ANIMATION_MS)
    }, delay)
  }

  const cancelClose = () => {
    clearTimeout(closeTimer)
    clearTimeout(closeAnimationTimer)
    markWarm()
  }

  panel.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "opacity" || isOpen(popup)) return
    clearTimeout(closeAnimationTimer)
    finishClose()
  })

  trigger.addEventListener("mouseenter", show)
  trigger.addEventListener("mouseleave", hide)
  popup.addEventListener("mouseenter", cancelClose)
  popup.addEventListener("mouseleave", hide)

  const reposition = () => {
    if (isOpen(popup) || !popup.hasAttribute("hidden")) {
      positionPopup(trigger, popup)
    }
  }

  window.addEventListener("scroll", reposition, { passive: true })
  window.addEventListener("resize", reposition)
}

export function initWorkItemPreviews() {
  if (!canHover()) return

  document.querySelectorAll<HTMLElement>("[data-work-preview]").forEach(initPreview)
}
