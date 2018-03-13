var forEach = require('../helpers/forEach.js')

describe('For each method', () => {
  var list = ['a', 'b', 'c']

  it('should go through all items in array', () => {
    var _loops = 0
    forEach(list, callback = (i, item) => {
      expect( item === list[i] ).toBeTruthy()
      _loops++
    })
    
    expect( _loops ).toBe( list.length )
  });

  it('should set scope', () => {
    this.scopeVar = 'test'

    forEach(list, callback = (i, item) => {
      expect( this.scopeVar ).toBe('test')
    }, this)
  });
});