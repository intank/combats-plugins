(function() {
  function plugin_chat_removeduplicates() {
    this.Init();
  }

  plugin_chat_removeduplicates.prototype = {
    'debugger': false,
    time: -1,
    removeDuplicates: true,
    removeOld: true,
    timeoutOld: 3,
    toString: function() {
      return "Удаление повторений в чате";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","chat_removeduplicates\\chat_removeduplicates.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","chat_removeduplicates\\chat_removeduplicates.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      return [
        { name: "Удалять предыдущие копии", value: this.removeDuplicates },
        { name: "Удалять устаревшие сообщения", value: this.removeOld },
        { name: "Оставлять сообщения за последние минуты:", value: this.timeoutOld }
      ];
    },
    setProperties: function(a) {
      try {
        this.removeDuplicates = a[0].value;
        this.removeOld = a[1].value;
        this.timeoutOld = parseInt(a[2].value);
        this.save('removeDuplicates',this.removeDuplicates?'true':'false');
        this.save('removeOld',this.removeOld?'true':'false');
        this.save('timeoutOld',a[2].value);
      } catch (e) {
        alert('Ошибка настройки: "'+e.message+'"');
      }
    },
    Init: function() {
      this.removeDuplicates = this.load('removeDuplicates','')=='true';
      this.removeOld = this.load('removeOld','')=='true';
      this.timeoutOld = parseInt(this.load('timeoutOld','3'));
      combats_plugins_manager.attachEvent(
        'onmessage',
        combats_plugins_manager.get_binded_method(this,this.processEvent));
    },
    processEvent: function(eventObj) {
      if (eventObj.mess=='')
        return;
      try {
        if (this['debugger'])
          debugger;
        if (this.removeOld) {
          var match=eventObj.mess.match(/^<font class="?(?:sys)?date2?"?>(\d\d)\:(\d\d)<\/font>/);
          if (match) {
            if (match[1].charAt(0)=='0')
              match[1] = match[1].substr(1);
            if (match[2].charAt(0)=='0')
              match[2] = match[2].substr(1);
            var time = parseInt(match[1])*60+parseInt(match[2]);
            var timeSpan = (time-this.time+1440)%1440;
            if (this.time<0 || timeSpan<12*60 || timeSpan>1440-this.timeoutOld) {
              this.time = time;
            } else {
              eventObj.mess = '';//'Сообщение удалено '+time+'('+this.time+')';
              return;
            }
          }
        }
        
        if (this.removeDuplicates) {
          if (!eventObj.mess.match(/<font\s+class="?date"?>.*?<\/font>\s+\[<SPAN>.*?<\/SPAN>\]/))
            return;
          var mess = eventObj.mess.replace(/( |&nbsp;|-|&shy;|<font class="?date"?[^>]*>\d+:\d+<\/font>\s*|^\s+|\:[\S]+?\:|<.*?>|\s+$|&quot;|"|'|\s+(?=\s)|\\|&#\d+;)/ig,'');
          var chatElement = top.Chat.Class.GetTab('oChat').Frame();
          for (var i=0; i<chatElement.childNodes.length; i++) {
            if (chatElement.childNodes[i].innerHTML.replace(/( |&nbsp;|-|&shy;|<font class="?date"?[^>]*>\d+:\d+<\/font>\s*|^\s+|\:[\S]+?\:|<.*?>|\s+$|&quot;|"|'|\s+(?=\s)|\\|&#\d+;)/ig,'')==mess) {
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
        }
      } catch(e) {
      }
    }
  };

  return new plugin_chat_removeduplicates();
})()