// FIXME: odokumentovat

var EXCEED_OFFSET = 5
var OFFSET_MARGIN = 5
var pointerSize, bodyRect, elemRect, scrollY, scrollX, bubbleH, bubbleW, targetH, targetW, viewportH

function _getTopByDirection (direction, position) {
  var Ydistance = elemRect.top + scrollY

  switch (direction) {
    case 'left':
    case 'right':
        return Ydistance + (targetH/2) - _getHorizontTopByPosition(position)
      break;
    case 'top': 
        return Ydistance - bubbleH - pointerSize - OFFSET_MARGIN
      break
    case 'bottom': 
        return Ydistance + targetH + pointerSize + OFFSET_MARGIN
      break
  }
}

function _getHorizontTopByPosition (position) {
  switch (position) {
    case 'start':  return 0; break
    case 'middle': return (bubbleH / 2); break
    case 'end':    return bubbleH; break
  }
}
/** -------------------------------------------------------- */

function _getLeftByDirection (direction, position) {
  var XDistance = elemRect.left + scrollX

  switch (direction) {
    case 'top':
    case 'bottom':
        return XDistance + bodyRect.left + (targetW/2) - pointerSize - _getVerticalLeftByPosition(position)
      break
    case 'right':
        return XDistance + bodyRect.left + targetW + pointerSize + OFFSET_MARGIN
      break;
    case 'left':
        return XDistance - bodyRect.left - bubbleW - pointerSize - OFFSET_MARGIN
      break
  }
}

/**
 * Computes position of bubble pointer
 * @param  {String} position Position of pointer relative to bubble
 * @return {Number}
 */
function _getVerticalLeftByPosition (position) {
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
function _getPointerWidth (elm, direction) {
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

function correctExceedment (tooltip, coordinates) {
  var _left        = coordinates.left
  var _top         = coordinates.top
  var _direction   = tooltip.direction
  var _position    = tooltip.position
  var _isExceeding = false

  switch (tooltip.direction) {
    case 'right':
      _isExceeding = (window.innerWidth - (_left + bubbleW + pointerSize)) < EXCEED_OFFSET
      if (_isExceeding) {
        _direction = 'bottom'
        _left      = _getLeftByDirection(_direction, _position)
        _top       = _getTopByDirection(_direction, _position)
      }
      break

    case 'left':
      _isExceeding = _left < (EXCEED_OFFSET/2)

      if (_isExceeding) {
        _direction = 'bottom'
        _position  = 'start'
        _left      = _getLeftByDirection(_direction, _position)
        _top       = _getTopByDirection(_direction, _position)
      }
      break

    case 'top':
      _isExceeding = (_top - scrollY) < EXCEED_OFFSET
      if (_isExceeding) {
        _direction = 'bottom'
        _top       = _getTopByDirection(_direction, _position)
      }
      break
 
    case 'bottom':
      var _topWithScroll = (_top + bubbleH + pointerSize - scrollY)
          _isExceeding   = (viewportH - _topWithScroll) < EXCEED_OFFSET/2
      if (_isExceeding) {
        _direction = 'top'
        _top       = _getTopByDirection(_direction, _position)
      }
      break

    default:
      return {
          left: coordinates.left
        , top: coordinates.top
        , _direction: tooltip.direction
      }
  }

  return {
      left: _left 
    , top: _top
    , direction: _direction
    , position: _position
  }
}

/**
 * Computes top and left position
 * @param  {Object} tooltip Instance of tooltip
 * @return {Object}         Left and top position
 */
function getOffsets (tooltip) {
  var _payload
  pointerSize  = _getPointerWidth(tooltip.bubbleElm, tooltip.direction)
  bodyRect  = document.body.getBoundingClientRect()
  elemRect  = tooltip.target.getBoundingClientRect()
  scrollY   = window.pageYOffset || document.documentElement.scrollTop
  scrollX   = window.pageXOffset || document.documentElement.scrollLeft
  bubbleH   = tooltip.bubbleElm.offsetHeight
  bubbleW   = tooltip.bubbleElm.offsetWidth
  targetH   = tooltip.target.offsetHeight
  targetW   = tooltip.target.offsetWidth
  viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight)

  _payload = correctExceedment(tooltip, {
      left: _getLeftByDirection(tooltip.direction, tooltip.position)
    , top: _getTopByDirection(tooltip.direction, tooltip.position)
  })

  return _payload
}

module.exports = getOffsets