(function() {
  return {
    toString: function() {
      return "Напоминание о посещении подземелья";
    },
    onloadHandler: function(eventObj) {
      if (eventObj.window.location.pathname!='/dungeon.pl')
        return;
      try {
        var elements = eventObj.window.document.getElementsByTagName('small');
        if (elements.length>0) {
          var match = elements[elements.length-1].innerText.match(/\(Вы можете посетить подземелье через\s*(?:(\d+) ч\.)?\s*(?:(\d+) мин\.)?.*?\)/);
          if (match) {
            var notify_handler = top.combats_plugins_manager.plugins_list['notify_handler'];
            var timespan = 0;
            timespan += (match[1]==''?0:parseInt(match[1])*60);
            timespan += (match[2]==''?0:parseInt(match[2]));
            if (/<H3>Гора Легиона<\/H3>/.test(eventObj.window.document.body.innerHTML)) {
              notify_handler.add_notification('legionMount_trip','До посещения Горы Легиона',parseInt((new Date()).getTime()/60000)+timespan);
            } else {
              notify_handler.add_notification('dungeon_trip','До посещения подземелья',parseInt((new Date()).getTime()/60000)+timespan);
            }
          }
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
