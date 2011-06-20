(function(){
  return {
    onload_handler: function(event_obj) {
      if (event_obj.window.location.pathname!='/shop.pl')
        return;
      if (event_obj.window.document.body.innerHTML.match(/<TD align=middle><B>Отдел "Скупка"<\/B>/i)) {
        var links = event_obj.window.document.links;
        var form = event_obj.window.document.forms[0];
        var i=0;
        var filter_str = '&level_filter='+form['level_filter'].value+'&class_filter='+form['class_filter'].value+'&name_filter='+form['name_filter'].value+'&filter=1';
        (function(){
	        for(var j=0;j<20&&i<links.length;j++,i++) {
    	    	if (!links[i].href.match(/\.combats\.com\/shop\.pl\?sl=/))
        			continue;
				links[i].href = links[i].href+filter_str;
	        }
	        if (i<links.length)
	        	setTimeout(arguments.callee,20);
        })();
      }
    },
    Init: function() {
      top.combats_plugins_manager.attachEvent('mainframe.load', this.onload_handler);
      return this;
    }
  }.Init();
})()