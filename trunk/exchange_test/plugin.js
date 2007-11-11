(function (){
  var plugin_sleep = function() {
    top.combats_plugins_manager.attachEvent(
      'exchange.transaction',
      combats_plugins_manager.get_binded_method(this,this.transferHandler));
  };

  plugin_sleep.prototype = {
    debug: [],
    toString: function() {
      return "Тест передач";
    },
    transferHandler: function(eventObj) {
      this.debug[this.debug.length] = eventObj;
      var s = '';
      for(var i in eventObj) {
        s += i+': '+eventObj[i]+'<BR>';
      }
      top.Chat.am(s);
    }
  };
  return new plugin_sleep();
})()