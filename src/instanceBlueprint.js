// __ prefix references to state property for easier cloning
const BubbleBP = {
    bubbleElm: null
  , content: ''
  , direction: 'bottom'
  , event: 'hover'
  , index: 0
  , position: 'middle'
  , SELECTOR_BUBBLE_CLASS: 'tooltip-info-bubble'
  , DATA_POSITION: 'tibPosition'
  , DATA_DIRECTION: 'tibDirection'
  , DATA_CONTENT: 'tibContent'
  , DATA_EVENT: 'tibEvent'
  , DATA_ID: 'tibId'
  , target: null
  , __event: null
  , __visible: false
};


module.exports = BubbleBP;