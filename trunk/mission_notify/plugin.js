(function() {
  function plugin_mission_notify() {
    top.combats_plugins_manager.attachEvent(
      'mainframe.load',
      top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
  }

  plugin_mission_notify.prototype = {
    toString: function() {
      return "Напоминание о доступном задании в подземельях";
    },
    onloadHandler: function() {
      if (top.combats_plugins_manager.getMainFrame().location.pathname!='/dungeon.pl')
        return;
      try {
        var elements = top.combats_plugins_manager.getMainFrame().document.getElementsByTagName('font');
        for(var i=0; i<elements.length; i++ ) {
          var match = elements[i].innerText.match(/Вы не можете получить задание еще\s*(?:(\d+) ч\.)?\s*(?:(\d+) мин\.)?/);
          if (match) {
            var notify_handler = top.combats_plugins_manager.plugins_list['notify_handler'];
            var timespan = 0;
            timespan += (match[1]==''?0:parseInt(match[1])*60);
            timespan += (match[2]==''?0:parseInt(match[2]));
            match = top.location.host.match(/^(.*?)\./);
            notify_handler.add_notification('mission','До получения задания в '+match[1],parseInt((new Date()).getTime()/60000)+timespan);
            break;
          }
          if (elements[i].innerText == 'Вы получили новое задание.') {
            var notify_handler = top.combats_plugins_manager.plugins_list['notify_handler'];
            match = top.location.host.match(/^(.*?)\./);
            notify_handler.add_notification('mission','До получения задания в '+match[1],parseInt((new Date()).getTime()/60000)+23*60);
            break;
          }
        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    }
  };

  return new plugin_mission_notify();
})()
