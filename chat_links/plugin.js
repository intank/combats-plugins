(function() {
  return {
    toString: function() {
      return "Восстановление ссылок в чате";
    },
    processLinks: function(match,eventObj) {
      var mess = eventObj.mess;
      var i = mess.indexOf('http://');
      var first = mess.substring(0,i);
      var result = '';
      mess = mess.slice(i);
      while (mess) {
        var match = mess.match(/^([^<]*?(\.?))([\s<])/);
        if (match) {
          result += match[1];
          mess = mess.slice(match.lastIndex);
          if (match[1].length<30 && match[2]!='.') {
            mess = match[3]+mess;
            break;
          }
        } else {
          break;
        }
      }
      if (/http\:\/\/[^\/]*combats.(com|ru)($|\/)/i.test(result)) {
        eventObj.mess = first+'<a href="'+result+'" target=_blank>'+result+'</a>'+mess;
      } else {
        eventObj.mess = first+'<span oncontextmenu="window.event.cancelBubble=true" onclick="window.event.cancelBubble=true">'+result+'</span> (:dont: ссылка вне зоны БК)'+mess;
      }
    },
    Init: function() {
      var filterPlugin = combats_plugins_manager.plugins_list['chat_filter'];
      if (!filterPlugin) {
        throw new Error('Для корретной работы нужен плагин chat_filter');
      }
      filterPlugin.addFilter(
        { filter:/(^|\s)http\:\/\/\S+/,
          handler:this.processLinks
        }
      );
      return this;
    }
  }.Init();
})()