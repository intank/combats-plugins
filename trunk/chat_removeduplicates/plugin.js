(function() {
  return {
    'debugger': false,
    time: -1,
    removeDuplicates: true,
    removeOldPrivate: true,
    removeOld: true,
    timeoutOld: 3,
    preserveChat: true,
    toString: function() {
      return "Управление чатом";
    },
    getProperties: function() {
      return [
        { name: "Удалять предыдущие копии", value: this.removeDuplicates },
        { name: "Удалять устаревший приват", value: this.removeOldPrivate },
        { name: "Удалять устаревший общий чат", value: this.removeOld },
        { name: "Оставлять сообщения за последние минуты:", value: this.timeoutOld },
        { name: "Сохранять чат при переходах", value: this.preserveChat }
      ];
    },
    setProperties: function(a) {
      try {
        this.removeDuplicates = a[0].value;
        this.removeOldPrivate = a[1].value;
        this.removeOld = a[2].value;
        this.timeoutOld = parseInt(a[3].value);
        this.preserveChat = a[4].value;
        this.config.saveIni('removeDuplicates',this.removeDuplicates?'true':'false');
        this.config.saveIni('removeOldPrivate',this.removeOldPrivate?'true':'false');
        this.config.saveIni('removeOld',this.removeOld?'true':'false');
        this.config.saveIni('timeoutOld',this.timeoutOld.toString());
        this.config.saveIni('preserveChat', this.preserveChat.toString());
      } catch (e) {
        alert('Ошибка настройки: "'+e.message+'"');
      }
    },
    CLR2: function() {
      if (!this.preserveChat)
        this.oldCLR2.apply(top, []);
    },
    Init: function() {
      this.config = combats_plugins_manager.createConfigurationElement('chat_removeduplicates');
      this.preserveChat = this.config.loadIni('preserveChat', 'false') == 'true';
      this.removeDuplicates = this.config.loadIni('removeDuplicates','')=='true';
      this.removeOld = this.config.loadIni('removeOld','')=='true';
      this.timeoutOld = parseInt(this.config.loadIni('timeoutOld','3'));

      this.oldCLR2 = top.CLR2;
      top.CLR2 = combats_plugins_manager.get_binded_method(this, this.CLR2);
      combats_plugins_manager.attachEvent(
        'onmessage',
        combats_plugins_manager.get_binded_method(this,this.processEvent));
      return this;
    },
    processEvent: function(eventObj) {
      if (eventObj.mess=='')
        return;
      try {
        if (this['debugger'])
          debugger;
        if (this.removeOld) {
          var match=eventObj.mess.match(/^<font class="?(?:sys)?date2?"?>(?:\d+\.\d+\.\d+\s+|)(\d\d)\:(\d\d)<\/font>/);
          if (match) {
            if (match[1].charAt(0)=='0')
              match[1] = match[1].substr(1);
            if (match[2].charAt(0)=='0')
              match[2] = match[2].substr(1);
            var time = parseInt(match[1])*60+parseInt(match[2]);
            var timeSpan = (time-this.time+1440)%1440;
            var isPrivate = this.removeOldPrivate && /private \[.*?\]/.test(eventObj.mess);
            if (this.time<0 || timeSpan<12*60) {
              this.time = time;
            }
            if ((timeSpan>12*60 && timeSpan<=1440-this.timeoutOld) || (isPrivate && this.time!=time)) {
              eventObj.mess = '';//'Сообщение удалено '+time+'('+this.time+')';
              return;
            }
          }
        }
        
        if (this.removeDuplicates) {
          if (!eventObj.mess.match(/<font\s+class="?date"?>.*?<\/font>\s+(?:\[<SPAN>.*?<\/SPAN>\]|<i><SPAN>.*?<\/SPAN>)/))
            return;
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
        }
      } catch(e) {
      }
    }
  }.Init();
})()