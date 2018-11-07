const BubbleBP = require('./instanceBlueprint');
const forEach = require('./helpers/forEach');

const instantiateTooltips = function (elementsToConvert) {
  const _instancesList = [];

  forEach( elementsToConvert, function (index, target) {
      const _content   = target.getAttribute('data-tib-content') || target.title;
      const _event     = target.getAttribute('data-tib-event') || BubbleBP.event;
      const _direction = target.getAttribute('data-tib-direction') || BubbleBP.direction;
      const _position  = target.getAttribute('data-tib-position') || BubbleBP.position;
      const _bubbleId  = target.getAttribute('data-tib-id') || null; 

      // There is no content to show in tooltip, dont initiate
      if (!_content) { return false; }
      
      // Sanitize empty title attribute, to prevent further problems with assigning content back
      if (target.title === '') {
        target.removeAttribute('title');
      }

      const _newBubble = Object.assign({}
        , BubbleBP
        , {
            content: _content
          , direction: _direction
          , event: _event
          , id: _bubbleId
          , index: _instancesList.length
          , position: _position
          , target: target
        });
      _instancesList[_instancesList.length] = _newBubble;

      // _bindEvents(_newBubble);
      // _prepareBubbleElement(_newBubble);
    });
  return _instancesList;
};

module.exports = instantiateTooltips;