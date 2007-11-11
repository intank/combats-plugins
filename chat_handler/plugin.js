(function() {
  plugin_chat_log = function() {
    this.Init();
  }

  plugin_chat_log.prototype = {
    processing: false,
    toString: function() {
      return "Обработка чата";
    },
    createFilename: function() {
      var date = new Date();
      return 'chat_log/'+top.getCookie('battle')+' '+date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+' '+date.getHours()+' log.html';
    },
    am: function(sText) {
      if (this.processing) {
        this.old_write_messages.apply(top.Chat,[sText]);
      } else {
        this.processing = true;
        try {
          var messages = sText.split('<BR>');
          for(var i=0;i<messages.length;i++) {
            var eventObj = {
              'mess': messages[i]
            };
            top.combats_plugins_manager.fireEvent('onmessage',eventObj);
            if (eventObj.mess)
              this.old_write_messages.apply(top.Chat,[eventObj.mess]);
          }
        } catch(e) {
          top.combats_plugins_manager.logError(this,e);
        }
        this.processing = false;
      }
    },
    wu: function(inv,name,id,align,klan,level,slp,trv,city,att,private,afk,afk_text,dnd,dnd_text,bat,ill,sms) {
      var eventObj = {
        name: name,
        id: id,
        align: align,
        klan: klan,
        level: level
      };
      top.combats_plugins_manager.fireEvent('onuserinfo',eventObj);
      this.old_wu.apply(top.frames['activeusers'],[inv,name,id,align,klan,level,slp,trv,city,att,private,afk,afk_text,dnd,dnd_text,bat,ill,sms]);
    },
    Init: function() {
      this.old_write_messages=top.Chat.am;
      top.Chat.am = top.combats_plugins_manager.get_binded_method(
        this, 
        this.am
      );
      
      this.old_wu = top.frames['activeusers'].wu;
      top.frames['activeusers'].wu = top.combats_plugins_manager.get_binded_method(
        this,
        this.wu
      );
    }
  };

  return new plugin_chat_log();
})()