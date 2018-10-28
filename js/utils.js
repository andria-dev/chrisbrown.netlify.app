export const throttle = (fn, wait) => {
  let time = Date.now()
  return () =>
    time + wait - Date.now() <= 0
      ? fn()
      : time = Date.now()
}

// brightness is on a scale from 0 -> 255
export const brightnessFromRGB = (r, g, b) => (r * 299 + g * 587 + b * 114) / 1000
export const brightnessFromElementBackground = el => brightnessFromRGB(
  ...getComputedStyle(el)
    .backgroundColor
    .slice(4, -1)
    .split(',')
    .map(x => parseInt(x))
)