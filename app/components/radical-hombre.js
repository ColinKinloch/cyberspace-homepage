Polymer({
  is: "radical-hombre",
  ready: function() {
    'use strict'
    let c = this.$.duder
    let gl = c.getContext('webgl') || c.getContext('experimental-webgl')
    console.log(gl)
  }
})
