(function() {
  var plugin_anti503 = function() {
    top.combats_plugins_manager.attachEvent(
      "mainframe.load",
      combats_plugins_manager.get_binded_method(this,this.onloadHandler)
    );
  };

  plugin_anti503.prototype = {
    stateError: false,
    timeOut: 1,
    timer: null,

    toString: function() {
      return "Автоматическое обновление 503";
    },

/*
    getProperties: function() {
      return [
        { name:"Время задержки до обновления", value: this.timeOut }
      ];
    },

    setProperties: function(a) {
      this.timeOut=parseInt(a[0].value);
    },
*/
    onUnload: function() {
      top.clearTimeout(this.timer);
      this.timer = null;
    },

    refresh: function() {
      top.clearTimeout(this.timer);
      this.timer = null;
      l = top.combats_plugins_manager.getMainFrame().location
      top.combats_plugins_manager.getMainFrame().location = l.protocol+"//"+l.host+l.pathname;
    },

    onloadHandler: function() {
      try {
        var d=top.combats_plugins_manager.getMainFrame().document;
        if (d.title=="[503] Service Unavailable" || d.title=="[504] Gateway Timeout" || d.title=="[502] Bad Gateway" || d.title.search('Server Error')>=0) {
          if (!this.stateError) {
            top.combats_plugins_manager.addLog((new Date()).toLocaleTimeString()+'Отказ сервера.');
            this.stateError = true;
          }
          $('body', d).prepend(
            $('<button>Обновить</button>', d)
              .css('width','100%')
              .click(function(){
                var l = top.combats_plugins_manager.getMainFrame().location;
                top.combats_plugins_manager.getMainFrame().location = l.protocol+"//"+l.host+l.pathname;
              })
          );
//          this.timer = top.setTimeout(this.refresh,1000*this.timeOut);
          d.parentWindow.attachEvent(
            "onbeforeunload", 
            combats_plugins_manager.get_binded_method(this,this.onUnload)
          );
        } else {
          if (this.stateError) {
            top.combats_plugins_manager.addLog((new Date()).toLocaleTimeString()+'Сервер вышел из состояния отказа.');
            this.stateError = false;
          }
        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    }
  };
  return new plugin_anti503();
})()