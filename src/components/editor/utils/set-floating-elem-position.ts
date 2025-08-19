export function setFloatingElemPosition(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap = 10,
  horizontalGap = 5
) {
  const scrollerElem = anchorElem.parentElement

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = "0"
    floatingElem.style.transform = "translate(-10000px, -10000px)"
    return
  }

  const floatingElemRect = floatingElem.getBoundingClientRect()
  anchorElem.getBoundingClientRect()
  const scrollerElemRect = scrollerElem.getBoundingClientRect()

  const top = targetRect.top - floatingElemRect.height - verticalGap
  const left = targetRect.left + horizontalGap

  if (top < scrollerElemRect.top) {
    floatingElem.style.top = `${
      targetRect.bottom + verticalGap
    }px`
  } else {
    floatingElem.style.top = `${top}px`
  }

  if (left + floatingElemRect.width > scrollerElemRect.right) {
    floatingElem.style.left = `${
      scrollerElemRect.right - floatingElemRect.width - horizontalGap
    }px`
  } else {
    floatingElem.style.left = `${left}px`
  }

  floatingElem.style.opacity = "1"
  floatingElem.style.transform = "translate(0, 0)"
}