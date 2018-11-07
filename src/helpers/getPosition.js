// FIXME: odokumentovat

const EXCEED_OFFSET = 5;
const OFFSET_MARGIN = 5;
let pointerSize, bodyRect, elemRect, scrollY, scrollX, bubbleH, bubbleW, targetH, targetW, viewportH;

function _getTopByDirection (direction, position) {
  const Ydistance = elemRect.top + scrollY;

  switch (direction) {
    case 'left':
    case 'right':
        return Ydistance + (targetH/2) - _getHorizontTopByPosition(position);
    case 'top': 
        return Ydistance - bubbleH - pointerSize - OFFSET_MARGIN;
    case 'bottom': 
        return Ydistance + targetH + pointerSize + OFFSET_MARGIN;
  }
}

function _getHorizontTopByPosition (position) {
  switch (position) {
    case 'start':  return 0;
    case 'middle': return (bubbleH / 2);
    case 'end':    return bubbleH;
  }
}
/** -------------------------------------------------------- */

function _getLeftByDirection (direction, position) {
  const XDistance = elemRect.left + scrollX;

  switch (direction) {
    case 'top':
    case 'bottom':
        return XDistance + bodyRect.left + (targetW/2) - pointerSize - _getVerticalLeftByPosition(position);
    case 'right':
        return XDistance + bodyRect.left + targetW + pointerSize + OFFSET_MARGIN;
    case 'left':
        return XDistance - bodyRect.left - bubbleW - pointerSize - OFFSET_MARGIN;
  }
}

/**
 * Computes position of bubble pointer
 * @param  {String} position Position of pointer relative to bubble
 * @return {Number}
 */
function _getVerticalLeftByPosition (position) {
  switch (position) {
    case 'start':  return 0; 
    case 'middle': return (bubbleW / 2);
    case 'end':    return bubbleW;
  }
}

/**
 * Computes bubble pointer size
 * @param  {HtmlElement} elm       Tooltip element
 * @param  {String} direction Direction bubble is facing
 * @return {Number}           Pointer size
 */
function _getPointerWidth (elm) {
  const _styles = window.getComputedStyle(elm, ':before');
  const _directions = ['top', 'left', 'right', 'bottom'];
  let _size;

  while( !_size ) {
    _size = parseFloat(_styles.getPropertyValue('border-'+ _directions[0] +'-width'));
    _directions.shift();

    // To prevent infinite cycle, fe. when we change :before for :after etc.
    if (!_directions.length) {
      break;
    }
  }
  
  return _size;
}

function correctExceedment (tooltip, coordinates) {
  let _left        = coordinates.left;
  let _top         = coordinates.top;
  let _direction   = tooltip.direction;
  let _position    = tooltip.position;
  let _isExceeding = false;

  switch (tooltip.direction) {
    case 'right':
      _isExceeding = (window.innerWidth - (_left + bubbleW + pointerSize)) < EXCEED_OFFSET;
      if (_isExceeding) {
        _direction = 'bottom';
        _left      = _getLeftByDirection(_direction, _position);
        _top       = _getTopByDirection(_direction, _position);
      }
      break;

    case 'left':
      _isExceeding = _left < (EXCEED_OFFSET/2);

      if (_isExceeding) {
        _direction = 'bottom';
        _position  = 'start';
        _left      = _getLeftByDirection(_direction, _position);
        _top       = _getTopByDirection(_direction, _position);
      }
      break;

    case 'top':
      _isExceeding = (_top - scrollY) < EXCEED_OFFSET;
      if (_isExceeding) {
        _direction = 'bottom';
        _top       = _getTopByDirection(_direction, _position);
      }
      break;
 
    case 'bottom':
      const _topWithScroll = (_top + bubbleH + pointerSize - scrollY);
          _isExceeding   = (viewportH - _topWithScroll) < EXCEED_OFFSET/2;
      if (_isExceeding) {
        _direction = 'top';
        _top       = _getTopByDirection(_direction, _position);
      }
      break;

    default:
      return {
          left: coordinates.left
        , top: coordinates.top
        , _direction: tooltip.direction
      };
  }

  return {
      left: _left 
    , top: _top
    , direction: _direction
    , position: _position
  };
}

/**
 * Computes top and left position
 * @param  {Object} tooltip Instance of tooltip
 * @return {Object}         Left and top position
 */
function getOffsets (tooltip) {
  let _payload;
    pointerSize  = _getPointerWidth(tooltip.bubbleElm, tooltip.direction);
    bodyRect  = document.body.getBoundingClientRect();
    elemRect  = tooltip.target.getBoundingClientRect();
    scrollY   = window.pageYOffset || document.documentElement.scrollTop;
    scrollX   = window.pageXOffset || document.documentElement.scrollLeft;
    bubbleH   = tooltip.bubbleElm.offsetHeight;
    bubbleW   = tooltip.bubbleElm.offsetWidth;
    targetH   = tooltip.target.offsetHeight;
    targetW   = tooltip.target.offsetWidth;
    viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight);

  _payload = correctExceedment(tooltip, {
      left: _getLeftByDirection(tooltip.direction, tooltip.position)
    , top: _getTopByDirection(tooltip.direction, tooltip.position)
  });

  return _payload;
}

module.exports = getOffsets;