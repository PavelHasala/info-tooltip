// __ prefix references to state property for easier cloning
var BubbleBP = {
    bubbleElm: null
  , content: ''
  , direction: 'bottom'
  , event: 'hover'
  , index: 0
  , position: 'middle'
  , SELECTOR_BUBBLE_CLASS: 'tooltip-info-bubble'
  , DATA_POSITION: 'data-tib-position'
  , DATA_DIRECTION: 'data-tib-direction'
  , DATA_CONTENT: 'data-tib-content'
  , DATA_EVENT: 'data-tib-event'
  , DATA_ID: 'data-tib-id'
  , target: null
  , __event: null
  , __visible: false
}


module.exports = BubbleBP