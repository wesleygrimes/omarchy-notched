// Pure layout rules shared by QML and the Node regression tests.
function positive(value, fallback) {
  var number = Number(value)
  return isFinite(number) && number > 0 ? number : fallback
}

function padding(options) {
  var value = options ? options.padding : undefined
  var number = Number(value)
  return value !== undefined && value !== null && isFinite(number) && number >= 0 ? number : 2
}

function rect(display, position, appleSilicon, options, inferredHeight, themeHeight) {
  options = options || {}
  if (!display || !appleSilicon || position !== "top" || options.enabled === false) return null
  if (!(inferredHeight > 0) || !isFinite(inferredHeight)) return null
  var screenWidth = positive(display.width, 0)
  var screenHeight = positive(display.height, 0)
  if (!screenWidth || !screenHeight) return null
  var scale = positive(display.devicePixelRatio, 1)
  // Calibrated visually on a 16-inch M2 Pro at 2x. Other panels may need tuning.
  var width = Math.min(screenWidth, Math.ceil(positive(options.width, 360) / scale))
  var height = Math.ceil(positive(options.height, inferredHeight * scale) / scale)
  height = Math.min(screenHeight, Math.max(height, positive(themeHeight, 0)))
  return { x: (screenWidth - width) / 2, y: 0, width: width, height: height }
}

function dropZone(x, screenWidth, notch, gap) {
  if (!notch || x < 0 || x > screenWidth) return null
  if (x >= notch.x - gap && x <= notch.x + notch.width + gap) return null
  var side = x < notch.x ? "left" : "right"
  var inner = side === "left" ? x > notch.x / 2
    : x < (notch.x + notch.width + screenWidth) / 2
  return { side: side, region: inner ? "center" : side, notchSide: inner ? side : "" }
}

// Arrays are the live shell config sections. Preserve all widget settings.
function moveEntry(from, to, fromIndex, toIndex, sameSection, toRegion, notchSide) {
  if (fromIndex < 0 || fromIndex >= from.length) return false
  var entry = from[fromIndex]
  var oldSide = entry && entry.notchSide ? entry.notchSide : ""
  if (toRegion === "center" && (notchSide === "left" || notchSide === "right")) {
    if (typeof entry === "string") entry = { id: entry }
    entry.notchSide = notchSide
  } else if (toRegion !== "center" && typeof entry === "object") {
    delete entry.notchSide
  }
  var newSide = entry && entry.notchSide ? entry.notchSide : ""
  from.splice(fromIndex, 1)
  if (sameSection && fromIndex < toIndex) toIndex -= 1
  toIndex = Math.max(0, Math.min(to.length, toIndex))
  to.splice(toIndex, 0, entry)
  return !sameSection || fromIndex !== toIndex || oldSide !== newSide
}

if (typeof module !== "undefined") {
  module.exports = { padding: padding, rect: rect, dropZone: dropZone, moveEntry: moveEntry }
}
