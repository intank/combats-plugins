(function() {
  var cpm = top.combats_plugins_manager;
  return {
    toString: function() {
      return "Ќапоминание о доступности портала";
    },
    onloadHandler: function() {
      if (cpm.getMainFrame().location.pathname!='/portal.pl')
        return;
      try {
        var match = $(cpm.getMainFrame().document.body).text().match(/¬рем€ до следующего перемещени€\:(?:\s*|.*? еще )(?:(\d+) ч\.\s*(?:(\d+) мин\.|)|(\d+) мин\.)/);
        if (match) {
          var notify_handler = cpm.plugins_list['notify_handler'];
          var timespan = 0;
          timespan += (match[1]=='' ? 0 : 60*match[1]);
          timespan += (match[2]=='' ? (match[3]==''?0:1*match[3]) : 1*match[2]);
          notify_handler.add_notification('portal','¬рем€ до следующего перемещени€',parseInt((new Date()).getTime()/60000)+timespan);
        }
      } catch (e) {
        cpm.logError(this,e);
      }
    },
    Init: function() {
      cpm.attachEvent(
        'mainframe.load',
        cpm.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.Init();
})()
