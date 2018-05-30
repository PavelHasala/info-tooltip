var BubbleBP = require('../instanceBlueprint')

var DEFAULT_TOOLTIP_CLASS   = BubbleBP.SELECTOR_BUBBLE_CLASS
var DIRECTION_CLASS_PREFIX  = 'tib-pos-'
var DIRECTION_CLASS_DEFAULT = 'bottom'
var POSITION_CLASS_DEFAULT  = 'middle'
var DATA_POSITION_SELECTOR  = 'data-position'

module.exports = function setBubblePointer (bubbleElm, direction, position) {
  var _direction = DIRECTION_CLASS_PREFIX + (direction || DIRECTION_CLASS_DEFAULT)
  var _position  = position || bubbleElm.getAttribute(DATA_POSITION_SELECTOR) || POSITION_CLASS_DEFAULT
  var _className = [DEFAULT_TOOLTIP_CLASS, _direction].join(' ')
  
  bubbleElm.className = _className
  bubbleElm.setAttribute(DATA_POSITION_SELECTOR, _position)
}

