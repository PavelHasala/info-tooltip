var BubbleBP = require('./../components/instanceBlueprint')

const DEFAULT_TOOLTIP_CLASS   = BubbleBP.SELECTOR_BUBBLE_CLASS
const DIRECTION_CLASS_PREFIX  = 'tib-pos-'
const DIRECTION_CLASS_DEFAULT = 'bottom'
const POSITION_CLASS_DEFAULT  = 'middle'
const DATA_POSITION_SELECTOR  = 'data-position'

module.exports = function setBubblePointer (bubbleElm, direction, position) {
  var _direction = DIRECTION_CLASS_PREFIX + (direction || DIRECTION_CLASS_DEFAULT)
  var _position  = position || bubbleElm.getAttribute(DATA_POSITION_SELECTOR) || POSITION_CLASS_DEFAULT
  var _className = [DEFAULT_TOOLTIP_CLASS, _direction].join(' ')
  
  bubbleElm.className = _className
  bubbleElm.setAttribute(DATA_POSITION_SELECTOR, _position)
}

