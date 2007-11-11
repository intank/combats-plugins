(function() {
  var plugin_anti503 = function() {
    top.combats_plugins_manager.attachEvent(
      "mainframe.load",
      combats_plugins_manager.get_binded_method(this,this.onloadHandler)
    );
  };

  plugin_anti503.prototype = {
    timeOut: 1,
    timer: null,

    toString: function() {
      return "Автоматическое обновление 503";
    },
    
    getProperties: function() {
      return [
        { name:"Время задержки до обновления", value: this.timeOut }
      ];
    },

    setProperties: function(a) {
      this.timeOut=parseInt(a[0].value);
    },

    onUnload: function() {
      top.clearTimeout(this.timer);
      this.timer = null;
    },

    refresh: function() {
      top.clearTimeout(this.timer);
      this.timer = null;
      l = top.frames[3].location
      top.frames[3].location = l.protocol+"//"+l.host+l.pathname;
    },

    onloadHandler: function() {
      if (top.frames[3].location.href.search(/^http\:\/\/\w+\.combats\.ru\//)!=0)
        return;
      try {
        var d=top.frames[3].document;
        if (d.title=="[503] Service Unavailable" || d.title=="[504] Gateway Timeout" || d.title.search('Server Error')>=0) {
          this.timer = top.setTimeout(this.refresh,1000*this.timeOut);
          d.parentWindow.attachEvent(
            "onbeforeunload", 
            combats_plugins_manager.get_binded_method(this,this.onUnload)
          );
        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    }
  };
  return new plugin_anti503();
})()