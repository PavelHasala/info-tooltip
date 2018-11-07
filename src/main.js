require('./less/main.less');

const getOffsets       = require('./helpers/getPosition');
const BubbleBP         = require('./instanceBlueprint');
const forEach          = require('./helpers/forEach');
const setBubblePointer = require('./helpers/setBubblePointer');

// TODO: convert to es6
// TODO: rozdelat na jednotlive moduly, aby zavislosti byli DI a testovatelne
(function () {
  if (!window.readystate) {
    window.readystate = require('readystate');
  }
  const _state = {
    instances: {}
  };


  const _initTooltips = function (root) {
    const _document = typeof root === 'object' && root.hasOwnProperty('querySelector') ? root : document;
    const elementsToConvert = _document.querySelectorAll('.ti-bubble');
    _state.instances = _instantiateTooltips(elementsToConvert);

    if (!window.TIB) {
      _exposePublicAPI();
    }
  };

  const _subscribeTooltip = function (tooltipId, subscriber) {
    const _tooltip = _state.instances[tooltipId];

    if (!_tooltip) {
      throw 'No tooltip with ID "'+ tooltipId +'" awailable.';
    }

    if (!subscriber || !subscriber.tagName) {
      throw 'No HTMLelement as subscriber provided.';
    }

    _bindEvents(_tooltip, subscriber);
  };

  const _exposePublicAPI = function () {
    const _TIB = {
      initTooltips: function (root) { 
        _initTooltips(root);
      },
      subscribe: function(tooltipId, subscriber) {
        _subscribeTooltip.apply(this, [tooltipId, subscriber]);
      }
    };

    Object.defineProperty(_TIB, 'instances', {
      get: function() {
        return _state.instances;
      }
    });

    window.TIB = _TIB;
  };

  const _instantiateTooltips = function (elementsToConvert) {
    const _instances = {};
    let _index = 0;

    forEach( elementsToConvert, function (index, target) {
        let _content   = _getTooltipContent(target);
        let _event     = target.dataset[BubbleBP.DATA_EVENT] || BubbleBP.event;
        let _direction = target.dataset[BubbleBP.DATA_DIRECTION] || BubbleBP.direction;
        let _position  = target.dataset[BubbleBP.DATA_POSITION] || BubbleBP.position;
        let _bubbleId  = target.dataset[BubbleBP.DATA_ID] || 'tib-' + _index++;

        if (_instances[_bubbleId]) {
          throw 'Tooltip with id "' + _bubbleId + '" already presented, not registering \n' + target.outerHTML;
        }

        // There is no content to show in tooltip, dont initiate
        if (!_content) {
          return false;
        }
        
        // Sanitize empty title attribute, to prevent further problems with assigning content back
        if (target.title === '') {
          target.removeAttribute('title');
        }
        // Creates shallow clone
        const _newBubble = Object.assign({}
          , BubbleBP
          , {
              direction: _direction
            , event: _event
            , id: _bubbleId
            , index: _index
            , position: _position
            , subscribers: []
            , target: target
        });
        _instances[_bubbleId] = _newBubble;

        _bindEvents(_newBubble);
      });

    return _instances;
  };

  const _prepareBubbleElement = function (tooltip) {
    const _content = _getTooltipContent(tooltip.target);
    const _tooltipHtml = document.createElement('div');
    _tooltipHtml.className = tooltip.SELECTOR_BUBBLE_CLASS;
    _tooltipHtml.dataset.datIid = tooltip.id;
    _tooltipHtml.id = 'tib--' + tooltip.id;
    _tooltipHtml.innerHTML = _content;
    setBubblePointer(_tooltipHtml, tooltip.direction, tooltip.position);

    tooltip.bubbleElm = _tooltipHtml;

    document.body.appendChild(_tooltipHtml);
  };

  /**
   * Binds events to show/hide tooltip on provided element.
   * @param  {Object} tooltip Instace with tooltip data
   * @param  {HtmlElement=} element If element we are binding events on is not initial target
   * TODO: Vyseparovat metody show/hide 
   * TODO: kontrolovat, zda pro dany tooltip uz neni subscriber nastaveny
   */
  const _bindEvents = function (tooltip, element) {
    const _target = element || tooltip.target;
    const _eventType = element && element.dataset.tibEvent || tooltip.event;
    let _handler;

    tooltip.subscribers.push(_target);

    switch (_eventType) {
      case 'focus': 
          _handler = _focusHandler.bind(tooltip);
          _target.addEventListener('focus', _handler);
          _target.addEventListener('blur', _handler);
        break;
      case 'hover': 
          _handler = _hoverHandler.bind(tooltip);
          _target.addEventListener('mouseover', _handler);
          _target.addEventListener('mouseout', _handler);
        break;
    }

    tooltip.show = function () {
      _prepareBubbleElement(this);

      const _offsets = getOffsets(this);
      // DEV && console.log(_offsets)

      if (this.target.title) {
        this.target.__title = this.target.title;
        this.target.title = '';
      }
    
      // When bubble exceeds window, we are correction position and bubble direction
      if (_offsets.direction) {
        setBubblePointer(
          this.bubbleElm, 
          _offsets.direction, 
          _offsets.position
        );
      }

      this.bubbleElm.style.top = _offsets.top + 'px';
      this.bubbleElm.style.left = _offsets.left + 'px';
      this.__visible = true;
      // for animation
      this.bubbleElm.dataset.visible = true;
    };

    tooltip.hide = function () {
      if (this.target.__title) {
        this.target.title = this.target.__title;
      }

      this.__visible = false;
      this.bubbleElm
        .parentNode
        .removeChild(this.bubbleElm);
    };
  };

  const _focusHandler = function(e) {
    if( e.type === 'focus' ) {
      this.__event = e.type;
      this.show();
    } else {
      this.__event = null;
      this.hide();
    }
  };

  const _getTooltipContent = function (elm) {
    if (!elm || !elm.tagName) {
      return '';
    }
    return elm.dataset[BubbleBP.DATA_CONTENT] || elm.title;
  };

  const _hoverHandler = function(e) {
    if (this.__event !== 'focus') {
      // To eliminate repeating event evaluating
      if (this.__visible && e.type === 'mouseout') {
        this.hide();
      }
      if (!this.__visible && e.type === 'mouseover') {
        this.show();
      }
    }
  };

  window.readystate.interactive(_initTooltips);
})();