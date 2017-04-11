// TODO: Osetrit pretekani mimo obrazovku
// FIXME: odokumentovat
var pointer, bodyRect, elemRect, scrollY, scrollX, bubbleH, bubbleW, targetH, targetW

var _getTopByDirection = function (direction, position) {
  var Ydistance = elemRect.top + scrollY

  switch (direction) {
    case 'left':
    case 'right':
        return Ydistance + (targetH/2) - _getHorizontTopByPosition(position)
      break;
    case 'top': 
        return Ydistance - bubbleH - pointer
      break
    case 'bottom': 
        return Ydistance + targetH + pointer
      break
  }
}

var _getHorizontTopByPosition = function (position) {
  switch (position) {
    case 'start':  return 0; break
    case 'middle': return (bubbleH / 2); break
    case 'end':    return bubbleH; break
  }
}
/** -------------------------------------------------------- */

var _getLeftByDirection = function (direction, position) {
  var XDistance = elemRect.left + scrollX

  switch (direction) {
    case 'top':
    case 'bottom':
        return XDistance + bodyRect.left + (targetW/2) - pointer - _getVerticalLeftByPosition(position)
      break
    case 'right':
        return XDistance + bodyRect.left + targetW + pointer
      break;
    case 'left':
        return XDistance - bodyRect.left - bubbleW - pointer
      break
  }
}

/**
 * Computes position of bubble pointer
 * @param  {String} position Position of pointer relative to bubble
 * @return {Number}
 */
var _getVerticalLeftByPosition = function (position) {
  switch (position) {
    case 'start':  return 0; break
    case 'middle': return (bubbleW / 2); break
    case 'end':    return bubbleW; break
  }
}

/**
 * Computes bubble pointer size
 * @param  {HtmlElement} elm       Tooltip element
 * @param  {String} direction Direction bubble is facing
 * @return {Number}           Pointer size
 */
var _getPointerWidth = function (elm, direction) {
  var _styles = window.getComputedStyle(elm, ':before')
  var _directions = ['top', 'left', 'right', 'bottom']
  var _size

  while( !_size ) {
    _size = parseFloat(_styles.getPropertyValue('border-'+ _directions[0] +'-width'))
    _directions.shift()

    // To prevent infinite cycle, fe. when we change :before for :after etc.
    if (!_directions.length) { 
      break;
    }
  }

  return _size
}

/**
 * Horizontal correction. When tooltip will exceed off screen,
 * take the scrollY and reduce it from dimension
 * @param  {Number} x LeftByDirection result
 * @return {Number}
 */
var _horizontalCorrection = function (x) {
  var _offX = (bubbleW + x) - window.innerWidth

  return _offX > 0 ? _offX + 10  : 0
}

/**
 * Computes top and left position
 * @param  {Object} tooltip Instance of tooltip
 * @return {Object}         Left and top position
 */
var getOffsets = function (tooltip) {
  var _left, _right
  pointer  = _getPointerWidth(tooltip.bubbleElm, tooltip.direction)
  bodyRect = document.body.getBoundingClientRect()
  elemRect = tooltip.target.getBoundingClientRect()
  scrollY  = window.pageYOffset || document.documentElement.scrollTop
  scrollX  = window.pageXOffset || document.documentElement.scrollLeft
  bubbleH  = tooltip.bubbleElm.offsetHeight
  bubbleW  = tooltip.bubbleElm.offsetWidth
  targetH  = tooltip.target.offsetHeight
  targetW  = tooltip.target.offsetWidth

  _left  = _getLeftByDirection(tooltip.direction, tooltip.position)
  _right = _getTopByDirection(tooltip.direction, tooltip.position)

  return {
      left: _left - _horizontalCorrection(_left)
    , top: _right
  }
}

module.exports = getOffsets