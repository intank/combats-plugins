(function() {
  return {
    toString: function() {
      return "Напоминание о доступности портала";
    },
    onloadHandler: function() {
      if (top.combats_plugins_manager.getMainFrame().location.pathname!='/portal.pl')
        return;
      try {
        var match = top.combats_plugins_manager.getMainFrame().document.documentElement.innerText.match(/Время до следующего перемещения\:\s*(?:(\d+) ч\.)?\s*(?:(\d+) мин\.)?/);
        if (match) {
          var notify_handler = top.combats_plugins_manager.plugins_list['notify_handler'];
          var timespan = 0;
          timespan += (match[1]==''?0:parseInt(match[1])*60);
          timespan += (match[2]==''?0:parseInt(match[2]));
          notify_handler.add_notification('portal','Время до следующего перемещения',parseInt((new Date()).getTime()/60000)+timespan);
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
