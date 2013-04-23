(function() {
  return {
    toString: function() {
      return "Напоминание о доступном задании в подземельях";
    },
    onloadHandler: function() {
      var d = top.combats_plugins_manager.getMainFrame().document;
		if (d.location.href.match(/\/main\.pl\?move_dialog=/)) {
			if ($('font[color=#ff0000],font[color=red]',combats_plugins_manager.getMainFrame().document).text()=='Вы получили новое задание.') {
				var botName = $('body script[src=""],body script:not([src])',combats_plugins_manager.getMainFrame().document).last().html().match(/drwfl\("(.*?)",/)[1];
				this.notify_handler.add_notification('mission','До получения задания у персонажа '+botName,parseInt((new Date()).getTime()/60000)+3*60);
			}
			return;
		}
      if (d.location.pathname!='/dungeon.pl')
        return;
      try {
        if (/(?:\?|&)ql=.*?/.test(d.location.search)) {
          var match = d.body.innerText.match(/Задания отсюда недоступны еще\s*(?:(\d+) ч\.)?\s*(?:(\d+) мин\.)?.*?/);
          if (match) {

            var timespan = 0;
            timespan += (match[1]==''?0:parseInt(match[1])*60);
            timespan += (match[2]==''?0:parseInt(match[2]));
            match = top.location.host.match(/^(.*?)\./);
            this.notify_handler.add_notification('mission','До получения задания в '+match[1],parseInt((new Date()).getTime()/60000)+timespan);
            return;
          }
        }
        var elements = d.getElementsByTagName('font');
        for(var i=0; i<elements.length; i++ ) {
          if (elements[i].innerText == 'Вы получили новое задание.') {
            match = top.location.host.match(/^(.*?)\./);
            this.notify_handler.add_notification('mission','До получения задания в '+match[1],parseInt((new Date()).getTime()/60000)+23*60);
            break;
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
      this.notify_handler = top.combats_plugins_manager.plugins_list['notify_handler'];
      return this;
    }
  }.Init();
})()
