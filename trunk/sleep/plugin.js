(function (){
  var plugin_sleep = function() {
    top.combats_plugins_manager.attachEvent(
      "mainframe.load",
      combats_plugins_manager.get_binded_method(this,this.onloadHandler));
  };

  plugin_sleep.prototype = {
    toString: function() {
      return "Усыпальница :)";
    },
    onloadHandler: function() {
      if (frames[3].location.href.search(/^http\:\/\/\w+\.combats\.ru\/house\.pl\?.*?path=1.200.[12]/)!=0)
        return;
      top.frames[3].location = frames[3].location.protocol+'//'+frames[3].location.hostname+'/house.pl?to_sleep=1&sd4=&room=4&'+Math.random();
    }
  };
  return new plugin_sleep();
})()