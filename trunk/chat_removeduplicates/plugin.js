(function() {
  function plugin_chat_removeduplicates() {
    this.Init();
  }

  plugin_chat_removeduplicates.prototype = {
    'debugger': false,
    toString: function() {
      return "Удаление повторений в чате";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","chat_removeduplicates\\chat_removeduplicates.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","chat_removeduplicates\\chat_removeduplicates.ini",top.getCookie('battle'),key,val);
    },
    Init: function() {
      combats_plugins_manager.attachEvent(
        'onmessage',
        combats_plugins_manager.get_binded_method(this,this.store));
    },
    store: function(eventObj) {
      if (eventObj.mess=='')
        return;
      try {
        if (this['debugger'])
          debugger;
        var mess = eventObj.mess.replace(/( |&nbsp;|­|&shy;|<font class="?date"?[^>]*>\d+:\d+<\/font>\s*|^\s+|\:[\S]+?\:|<.*?>|\s+$|&quot;|"|'|\s+(?=\s)|\\|&#\d+;)/ig,'');
        var chatElement = top.Chat.Class.GetTab('oChat').Frame();
        for (var i=0; i<chatElement.childNodes.length; i++) {
          if (chatElement.childNodes[i].innerHTML.replace(/( |&nbsp;|­|&shy;|<font class="?date"?[^>]*>\d+:\d+<\/font>\s*|^\s+|\:[\S]+?\:|<.*?>|\s+$|&quot;|"|'|\s+(?=\s)|\\|&#\d+;)/ig,'')==mess) {
            if (chatElement.childNodes[0].firstChild.tagName=='FONT') {
              var s = chatElement.childNodes[i].firstChild.title;
              var ss = chatElement.childNodes[i].firstChild.innerHTML;
              if (s=='') {
                s = ss;
              } else {
                s = s.split("\n").slice(-5).join("\n")+"\n"+ss;
              }
              eventObj.mess = eventObj.mess.replace(/<(font class="?date2?"?)>/i,'<$1 title="'+s+'">');
            }
            chatElement.removeChild(chatElement.childNodes[i]);
            break;
          }
        }
      } catch(e) {
      }
    }
  };

  return new plugin_chat_removeduplicates();
})()