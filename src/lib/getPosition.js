// TODO: Osetrit pretekani mimo obrazovku
// FIXME: odokumentovat
var pointer, bodyRect, elemRect, scrollY, scrollX, bubbleH, bubbleW, targetH, targetW

var _getTopByDirection = function (direction, position) {
  var Ydistance = elemRect.top + scrollY

  switch (direction) {
    case 'left':
    case 'right':
        return Ydistance + (targetH / 2) - _getHorizontTopByPosition(position)
      break;
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
    case 'right':
        return XDistance + bodyRect.left + targetW + pointer
      break;
    case 'left':
        return XDistance - bodyRect.left - bubbleW - pointer
      break
  }
}

var _getVerticalLeftByPosition = function (position) {
  switch (position) {
    case 'start':  return 0; break
    case 'middle': return (bubbleW / 2); break
    case 'end':    return bubbleW; break
  }
}

var _getPointerWidth = function (elm, direction) {
  var _styles = window.getComputedStyle(elm, ':after')
  var _directions = ['top', 'left', 'right', 'bottom']
  var _size

  while( !_size ) {
    _size = parseFloat(_styles.getPropertyValue('border-'+ _directions[0] +'-width'))
    _directions.shift()
  }

  return _size
}

var getOffsets = function (tooltip) {
  pointer  = _getPointerWidth(tooltip.bubbleElm, tooltip.direction)
  bodyRect = document.body.getBoundingClientRect()
  elemRect = tooltip.target.getBoundingClientRect()
  scrollY  = window.pageYOffset || document.documentElement.scrollTop
  scrollX  = window.pageXOffset || document.documentElement.scrollLeft
  bubbleH  = tooltip.bubbleElm.offsetHeight
  bubbleW  = tooltip.bubbleElm.offsetWidth
  targetH  = tooltip.target.offsetHeight
  targetW  = tooltip.target.offsetWidth

  return {
      left: _getLeftByDirection(tooltip.direction, tooltip.position)
    , top: _getTopByDirection(tooltip.direction, tooltip.position)
  }    
    
    // case 'left':
    //   return {
    //     left: elemRect.left - tooltip.target.offsetWidth - (bodyRect.left * 2) - _constant,
    //     top: elemRect.top - (tooltip.bubbleElm.offsetHeight / 2) + (bodyRect.top)
    //   }
    //   break

    // case 'top':
    //   return {
    //     left: elemRect.left + scrollX + bodyRect.left,
    //     top: elemRect.top + scrollY - bubbleH - outerHeight(tooltip.target) + bodyRect.top
    //   }

    // case 'bottom':
    //   return {
    //     left: elemRect.left + (bodyRect.left * 2),
    //     top: elemRect.top + tooltip.bubbleElm.offsetHeight - (bodyRect.top) - _constant
    //   }

  //   default: 
  //     return { left : 0, top: 0 }
  // }
}

module.exports = getOffsets