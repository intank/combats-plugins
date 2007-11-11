(function() {
  function plugin_elix_notify() {
    top.combats_plugins_manager.attachEvent(
      'mainframe.load',
      top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
  }

  plugin_elix_notify.prototype = {
    toString: function() {
      return "Уведомление о заканчивающихся эликсирах";
    },
    onloadHandler: function() {
      if (top.frames[3].location.pathname.search(/^\/(main|battle\d*)\.pl/)!=0)
        return;
      var notify_handler = top.combats_plugins_manager.plugins_list['notify_handler'];
      try {
        tables=top.frames[3].document.getElementsByTagName('TABLE');
        var images=null;
        if(tables.length>=7 && tables[6].cells.length==3)
          images=tables[6].cells[1].getElementsByTagName('img');
        else if(tables.length>=6 && tables[5].cells.length==3)
          images=tables[5].cells[1].getElementsByTagName('img');
        if(images!=null) {
          var notify_list=new Object();
          var now = parseInt((new Date()).getTime()/60000);
          cnt=0;
          for(var i=0;i<images.length;i++) {
            if(images[i].src.search(/http\:\/\/img\.combats\.ru\/i\/misc\/icons\/(icon_pot_base_|spell_|wis_)/)!=0)
              continue;
            var onmouseover = images[i].onmouseover;
            if (onmouseover==null)
              onmouseover = images[i].parentNode.onmouseover;
            if (onmouseover==null)
              continue;
            hint=onmouseover.toString().match(/fastshow\(\".*?<B>(.*?)<.*?Осталось\:\s*([^<]*).*\",\d+\)/);
            if (hint==null)
              continue;
            cnt=1;
            s=hint[1];
            hint=hint[2].match(/(?:(\d+)\s*дн\.)?\s*(?:(\d+)\s*ч\.)?\s*(?:(\d+)\s*мин\.)?\s*(?:(\d+)\s*сек\.)?/);
            var timespan = 0;
            timespan += (hint[1]==''?0:parseInt(hint[1])*1440);
            timespan += (hint[2]==''?0:parseInt(hint[2])*60);
            timespan += (hint[3]==''?0:parseInt(hint[3]));

            notify_list[s]=now+timespan;
          }
          notify_handler.clear_notifications('elix');
          for(var i in notify_list)
            notify_handler.add_notification('elix',i,notify_list[i]);
        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    }
  };

  return new plugin_elix_notify();
})()
