var readystate = require('readystate')

if (DEV) {
  window.readystate = readystate
}

require('./less/main.less')
// var instantiateTooltips = require('./components/instantiateTooltips')
var getOffsets = require('./lib/getPosition')
var BubbleBP = require('./components/instanceBlueprint')
var forEach = require('./lib/forEach')

// TODO: remove harcoded top and left position when hiding a bubble
// TODO: convert to es6
// TODO: rozdelat na jednotlive moduly, aby zavislosti byli DI a testovatelne
;(function () {
  DEV && console.log('DEV MODE')

  var CONFIG = {
    selector: 'tooltip-info-bubble'
  }

  var _state = {
    instances: {}
  }


  var _initTooltips = function (root) {
    var _document = typeof root === 'object' && root.hasOwnProperty('querySelector') ? root : document
    var elementsToConvert = _document.querySelectorAll('.ti-bubble')
    _state.instances = _instantiateTooltips(elementsToConvert)

    if (!window.TIB) {
      _exposePublicAPI()
    }
  }

  var _subscribeTooltip = function (tooltipId, subscriber) {
    var _tooltip = _state.instances[tooltipId]

    if (!_tooltip) {
      throw 'No tooltip with ID "'+ tooltipId +'" awailable.'
    }

    if (!subscriber || !subscriber.tagName) {
      throw 'No HTMLelement as subscriber provided.'
    }

    _bindEvents(_tooltip, subscriber)
  }

  var _exposePublicAPI = function () {
    var _TIB = {
      initTooltips: function (root) { 
        _initTooltips(root)
      },
      subscribe: function(tooltipId, subscriber) {
        _subscribeTooltip.apply(this, arguments)
      }
    }

    Object.defineProperty(_TIB, 'instances', {
      get: function() {
        return _state.instances
      }
    });

    window.TIB = _TIB
  }

  var _instantiateTooltips = function (elementsToConvert) {
    var _instances = {}
    var _index = 0

    forEach( elementsToConvert, function (index, target) {
        var _content   = target.getAttribute('data-tib-content') || target.title
        var _event     = target.getAttribute('data-tib-event') || BubbleBP.event
        var _direction = target.getAttribute('data-tib-direction') || BubbleBP.direction
        var _position  = target.getAttribute('data-tib-position') || BubbleBP.position
        var _bubbleId  = target.getAttribute('data-tib-id') || 'tib-' + _index++ 

        if (_instances[_bubbleId]) {
          throw 'Tooltip with id "' + _bubbleId + '" already presented, not registering \n' + target.outerHTML
        }

        // There is no content to show in tooltip, dont initiate
        if (!_content) {
          return false
        }
        
        // Sanitize empty title attribute, to prevent further problems with assigning content back
        if (target.title === '') {
          target.removeAttribute('title')
        }
        // Creates shallow clone
        var _newBubble = Object.assign({}
          , BubbleBP
          , {
              content: _content
            , direction: _direction
            , event: _event
            , id: _bubbleId
            , index: _index
            , position: _position
            , subscribers: []
            , target: target
          })
        _instances[_bubbleId] = _newBubble

        _prepareBubbleElement(_newBubble)
        _bindEvents(_newBubble)
      })

    return _instances
  }

  var _prepareBubbleElement = function (tooltip) {
    var _direction = {
        left: 'tib-pos-left'
      , right: 'tib-pos-right'
      , top: 'tib-pos-top'
      , bottom: 'tib-pos-bottom'
    }
    var _tooltipHtml = document.createElement('div');
    if (typeof _tooltipHtml.classList !== 'undefined') {
      _tooltipHtml.classList.add(CONFIG.selector)
      _tooltipHtml.classList.add(_direction[tooltip.direction])
    } else {
      _tooltipHtml.className = CONFIG.selector + ' ' + _direction[tooltip.direction]
    }
    // _tooltipHtml.id = tooltip.id
    _tooltipHtml.setAttribute('data-id', tooltip.id)
    _tooltipHtml.innerHTML = tooltip.content
    _tooltipHtml.setAttribute('data-position', tooltip.position)

    tooltip.bubbleElm = _tooltipHtml

    document.body.appendChild(_tooltipHtml)
  }

  /**
   * Binds events to show/hide tooltip on provided element.
   * @param  {Object} tooltip Instace with tooltip data
   * @param  {HtmlElement=} element If element we are binding events on is not initial target
   * TODO: Vyseparovat metody show/hide 
   * TODO: kontrolovat, zda pro dany tooltip uz neni subscriber nastaveny
   */
  var _bindEvents = function (tooltip, element) {
    var _target = element || tooltip.target
    var _eventType = element && element.getAttribute('data-tib-event') || tooltip.event

    tooltip.subscribers.push(_target)

    switch (_eventType) {
      case "focus": 
          var _handler = _focusHandler.bind(tooltip)
          _target.addEventListener('focus', _handler)
          _target.addEventListener('blur', _handler)
        break
      case "hover": 
          var _handler = _hoverHandler.bind(tooltip)
          _target.addEventListener('mouseover', _handler)
          _target.addEventListener('mouseout', _handler)
        break
    }

    tooltip.show = function () {
      var _offsets = getOffsets(this)
      // DEV && console.log(_offsets)


      if (this.target.title) {
        this.target.title = ''
      }

      this.__visible = true;
      this.bubbleElm.style.top = _offsets.top + 'px'
      this.bubbleElm.style.left = _offsets.left + 'px'
      this.bubbleElm.setAttribute('data-visible','true')
    }

    tooltip.hide = function () {
      if (this.target.hasAttribute('title')) {
        this.target.title = this.content
      }
    
      this.__visible = false;
      this.bubbleElm.removeAttribute('data-visible')
      this.bubbleElm.style.top = '-10000px'
      this.bubbleElm.style.left = '-10000px'
    }
  }

  var _focusHandler = function(e) {
    if( e.type === 'focus' ) {
      this.__event = e.type
      this.show()
    } else {
      this.__event = null
      this.hide()
    }
  }

  var _hoverHandler = function(e) {
    if (this.__event !== 'focus') {
      // To eliminate repeating event evaluating
      if (this.__visible && e.type === 'mouseout') {
        this.hide()
      }
      if (!this.__visible && e.type === 'mouseover') {
        this.show()
      }
    }
  }

  readystate.interactive(_initTooltips)
})()