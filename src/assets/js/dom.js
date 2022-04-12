export function addClass(el, className) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
  console.log(el.classList)
}

export function removeClass(el, className) {
  el.classList.remove(className)
}
