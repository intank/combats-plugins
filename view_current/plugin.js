(function(){
  return {
    toString: function() {
      return 'Просмотр текущих боёв';
    },
    doFilter: function() {
      var doc = combats_plugins_manager.getMainFrame().document;
      var table = doc.forms[0].elements['tklogs'].parentNode.parentNode.parentNode.parentNode;
      var iframe = doc.createElement('<iframe src="http://www.darklaw.ru/current.php?mini_view=1&city='+doc.location.host.replace(/(?:city)?\..*$/,'')+'" style="width:100%; height:500px; border:0;" border="0">')
      table.parentNode.insertBefore(iframe, table);

      var obj = table;
      while(obj && obj.nodeName!='HR') {
        var nextObj = obj.nextSibling;
        obj.parentNode.removeChild(obj);
        obj = nextObj;
      }
    },
    onLoad: function() {
      var doc = combats_plugins_manager.getMainFrame().document;
      if (doc.location.pathname=='/zayavka.pl' && doc.location.search.match(/^\?tklogs=1/)) {
        var container = doc.forms[0].elements['tklogs'].parentNode;
        var button = doc.createElement('<input type="button" value="Отфильтровать">');
        button.onclick = combats_plugins_manager.get_binded_method(this,this.doFilter);
        container.insertBefore(button);
      }
    },
    Init: function() {
      combats_plugins_manager.attachEvent(
        'mainframe.load',
        combats_plugins_manager.get_binded_method(this,this.onLoad));
      return this;
    }
  }.Init();
})()