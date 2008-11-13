(function(){
  return {
    onLoad: function() {
      var doc = combats_plugins_manager.getMainFrame().document;
      if (doc.location.pathname=='/zayavka.pl' && doc.location.search.match(/\?level=haos/)) {
        var centerElemetns = doc.getElementsByTagName('CENTER');
        if (centerElemetns.length>0 && centerElemetns[centerElemetns.length-1].innerText.indexOf('¬ этой комнате невозможно подавать за€вки')>=0) {
          centerElemetns[centerElemetns.length-1].parentElement.removeChild(centerElemetns[centerElemetns.length-1]);
          var match = doc.body.innerHTML.match(/<SCRIPT>drwfl\(".*?",.*?,"(.*?)",.*?\)<\/SCRIPT>/);
          var level = '';
          if (match) {
            level = match[1];
          }
          var iframe = doc.createElement('<iframe src="http://www.darklaw.ru/claims.php?mini_view=1#city='+doc.location.host.replace(/(?:city)?\..*$/,'')+',level='+level+'" style="width:100%; height:500px; border:0;">')
          doc.forms['F1'].insertBefore(iframe, null);
        }
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