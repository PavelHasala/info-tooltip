;(function () {
  if (DEV) {
    require('./_dev/dev.less')
    require('./style.less')
  }
  var getOffsets = require('./lib/getPosition')

  // TODO: add check for js and css must haves
  var BubbleBP = {
      selector: 'tooltip-info-bubble'
    , index: 0
    , visible: false
    , content: ''
    , event: 'hover'
    , target: null
    , bubbleElm: null
    , direction: 'right'
    , position: 'middle'
  }
  var bubbles = []

  var initBubbles = function (root) {
    var _elementsToConvert = document.querySelectorAll('.ti-bubble')
      forEach( _elementsToConvert, function (index, target) {
        var _content = target.getAttribute('data-tib-content') || target.title
        var _event = target.getAttribute('data-tib-event') || BubbleBP.event
        var _direction = target.getAttribute('data-tib-direction') || BubbleBP.direction
        var _position = target.getAttribute('data-tib-position') || BubbleBP.position

        // There is no content to show in tooltip, dont initiate
        if (!_content) { return false }
        
        // Sanitize empty title attribute, to prevent further problems
        if (target.title === '') { target.removeAttribute('title') }

        var _newBubble = Object.assign({}
          , BubbleBP
          , {
              event: _event
            , index: bubbles.length
            , target: target
            , direction: _direction
            , content: _content
            , position: _position
          })
        bubbles[bubbles.length] = _newBubble

        _bindEvents(_newBubble)
        _prepareBubbleElement(_newBubble)
      })
  }

  var _prepareBubbleElement = function (bubble) {
    var _direction = {
        left: 'tib-pos-left'
      , right: 'tib-pos-right'
      , top: 'tib-pos-top'
      , bottom: 'tib-pos-bottom'
    }
    var _bubbleHtml = document.createElement('div');
    if (typeof _bubbleHtml.classList !== 'undefined') {
      _bubbleHtml.classList.add(bubble.selector)
      _bubbleHtml.classList.add(_direction[bubble.direction])
    } else {
      _bubbleHtml.className = bubble.selector + ' ' + _direction[bubble.direction]
    }
    _bubbleHtml.id = bubble.selector + '-' + bubble.index
    _bubbleHtml.innerHTML = bubble.content
    _bubbleHtml.setAttribute('data-position', bubble.position)

    bubble.bubbleElm = _bubbleHtml

    document.body.appendChild(_bubbleHtml)
  }

  var _bindEvents = function (bubble) {
    switch (bubble.event) {
      case "focus": 
          var _handler = _focusHandler.bind(bubble)
          bubble.target.addEventListener('focus', _handler)
          bubble.target.addEventListener('blur', _handler)
        break
      case "hover": 
          var _handler = _hoverHandler.bind(bubble)
          bubble.target.addEventListener('mouseover', _handler)
          bubble.target.addEventListener('mouseout', _handler)
        break
    }

    bubble.show = function () {
      var _offsets = getOffsets(this)
      if (DEV) { console.log(_offsets) }
      if (this.target.title) {
        this.target.title = ''
      }

      this.visible = true;
      this.bubbleElm.style.top = _offsets.top + 'px'
      this.bubbleElm.style.left = _offsets.left + 'px'
      this.bubbleElm.setAttribute('data-visible','true')
    }

    bubble.hide = function () {
      if (this.target.hasAttribute('title')) {
        this.target.title = this.content
      }
    
      this.visible = false;
      this.bubbleElm.removeAttribute('data-visible')
      this.bubbleElm.style.top = '0px'
      this.bubbleElm.style.left = ''
    }
  }

  

  var _focusHandler = function(e) {
    this[e.type === 'focus' ? 'show' : 'hide']()
  }

  var _hoverHandler = function(e) {
    // To eliminate repeated event evaluating
    if (this.visible && e.type === 'mouseout') {
      this.hide()
    }
    if (!this.visible && e.type === 'mouseover') {
      this.show()
    }
  }

  var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]);
    }
  };

  document.addEventListener('DOMContentLoaded', initBubbles, false);
})()