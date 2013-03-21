(function() {
  return {
    toString: function() {
      return "Напоминание об общении с ангелами";
    },
    onloadHandler: function(eventObj) {
      if (eventObj.window.location.pathname!='/astral.pl')
        return;
      try {
        if (typeof(eventObj.window.res)=='object' && eventObj.window.res.dialog_blocked_remaining>0){
            var notify_handler = top.combats_plugins_manager.plugins_list['notify_handler'];
            var timespan = Math.floor(eventObj.window.res.dialog_blocked_remaining/60);
            notify_handler.add_notification('astral','До следующего общения с ангелами',parseInt((new Date()).getTime()/60000)+timespan);
        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    },
    Init: function() {
      top.combats_plugins_manager.attachEvent(
        'mainframe.load',
        top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.Init();
})()
