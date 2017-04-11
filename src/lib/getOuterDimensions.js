function outerHeight (elm) {
  elm = (typeof elm === 'string') ? document.querySelector(elm) : elm
  
  var styles = window.getComputedStyle(elm)
  var paddingVert = parseFloat(styles['paddingTop']) +
                    parseFloat(styles['paddingBottom']) -
                    parseFloat(styles['marginTop']) - 
                    parseFloat(styles['marginBottom'])

  
  return Math.ceil(elm.offsetHeight + paddingVert)
}

function outerWidth (elm) {
  elm = (typeof elm === 'string') ? document.querySelector(elm) : elm;

  var styles = window.getComputedStyle(elm)
  var paddingHorz = parseFloat(styles['paddingLeft']) +
                    parseFloat(styles['paddingRight'])

  return Math.ceil(elm.offsetWidth + paddingHorz)
}