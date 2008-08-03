(function() {
  plugin_exchange_sound = function() {
    this.autoAccept = (this.load('autoAccept','false')=='true');
    this.autoCommit = (this.load('autoCommit','false')=='true');
    this.loadBlackList();
    top.combats_plugins_manager.attachEvent('exchange.confirm',
      top.combats_plugins_manager.get_binded_method(this,this.exchangeConfirm));
    top.combats_plugins_manager.attachEvent('exchange.confirmDlg',
      top.combats_plugins_manager.get_binded_method(this,this.exchangeConfirmDlg));
    top.combats_plugins_manager.attachEvent('exchange.completed',
      top.combats_plugins_manager.get_binded_method(this,this.exchangeCompleted));
    top.combats_plugins_manager.attachEvent('fighterContextMenu', 
      top.combats_plugins_manager.get_binded_method(this, this.handlerCtxMenu));
  }

  plugin_exchange_sound.prototype = {
    autoAccept: false,
    autoCommit: false,
    blackListIndicator: null,
    toString: function() {
      return "Звуковое уведомление о приглашении в передачи";
    },
    getProperties: function() {
      return [
        { name:"Автоматически подтверждать приглашение", value: this.autoAccept },
        { name:"Автоматически выходить из передач", value: this.autoCommit },
        { name:"Добавить в чёрный список", value:'' },
        { name:"Добавить", value:this.addBlackList }
      ];
    },
    setProperties: function(a) {
      this.autoAccept=a[0].value;
      this.autoCommit=a[1].value;
      this.save('autoAccept',this.autoAccept.toString());
      this.save('autoCommit',this.autoCommit.toString());
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","exchange_sound\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","exchange_sound\\settings.ini",top.getCookie('battle'),key,val);
    },
    addBlackList: function(a) {
      this.addPersToBlackList(a[2].value);
    },
    loadBlackList: function() {
      var blacklist = this.load('BlackList','');
      this.blacklist = {};
      if (blacklist!='') {
        blacklist = blacklist.split(';');
        for(var i=0; i<blacklist.length; i++) {
          this.blacklist[blacklist[i]] = true;
        }
      }
    },
    saveBlackList: function() {
      var blacklist = [];
      for (var name in this.blacklist) {
        blacklist.push(name);
      }
      blacklist = blacklist.join(';');
      this.save('BlackList',blacklist);
    },
    addPersToBlackList: function(a) {
      this.blacklist[a] = true;
      this.saveBlackList();
    },
    handlerCtxMenu: function(eventObj) {
      if (!this.blackListIndicator) {
        this.blackListIndicator = top.document.createElement('DIV');
        top.Chat.Self.oCtxMenu.insertBefore(this.blackListIndicator,null);
        this.blackListIndicator.style.color = '#D00000';
        this.blackListIndicator.style.padding = '2px 12px 2px 8px';
      }
      if (this.blacklist[top.Chat.Self.oCtxMenu.sLogin]) {
        this.blackListIndicator.style.display = '';
        this.blackListIndicator.innerText = 'Персонаж в ЧС';
      } else {
        this.blackListIndicator.style.display = 'none';
      }
    },
    exchangeCompleted: function() {
      var match=combats_plugins_manager.getMainFrame().document.body.innerHTML.match(/<TD .*?>Вы получили от\s*<SCRIPT>drwfl\("(.*?)",.*?\)<\/SCRIPT>\s*.*?\: (.*?) кр\.<\/TD>/mi);
      if (match) {
        combats_plugins_manager.add_chat('Получено '+match[2]+' кр. от <SPAN>'+match[1]+'</SPAN>');
      }

      if (!this.autoCommit)
        return;

      setTimeout(
        function() {
          try {
            var buttons=combats_plugins_manager.getMainFrame().document.getElementsByTagName('button');
            for(var i=0; i<buttons.length; i++) {
              if (buttons[i].value=='Вернуться') {
                buttons[i].click();
                break;
              }
            }
          } catch (e) {
          }
        }, 
        100
      );
    },
    exchangeConfirm: function( ){
      this.snotify(1,'nocheck');
    },
    sendAutoResponse: function(message) {
      if (!this.sender)
        this.sender = combats_plugins_manager.plugins_list['chat_sender'];
      if (this.sender)
        this.sender.send(message);
    },
    confirmClick: function(Ok) {
      try {
        if (Ok)
          top.Window.oConfirm.oOk.click();
        else
          top.Window.oConfirm.oCancel.click();
      } catch(e) {
        combats_plugins_manager.logError(this,e);
      }
    },
    exchangeConfirmDlg: function( eventObj ){
      if (this.autoAccept) {
        try {
          var match = eventObj.oRoot.text.match(/"(.+)" хочет совершить с вами сделку/);
          var name = match?match[1]:'';
          if (name in this.blacklist) {
            setTimeout(combats_plugins_manager.get_binded_method(this, this.confirmClick, false),0);
            this.sendAutoResponse('private ['+name+'] Ну нет у меня сейчас желания меняться! Заходите в понедельник');
          } else {
            setTimeout(combats_plugins_manager.get_binded_method(this, this.confirmClick, true),0);
          }
        } catch(e) {
          combats_plugins_manager.logError(this,e);
        }
      }
    },
    snotify: function( sid, chk ) {
      var volume=top.frames['bottom'].soundvol;
      top.frames['bottom'].window.document.Sound.SetVariable("Volume", (volume*50));
      top.frames['bottom'].window.document.Sound.SetVariable("Sndplay",sid);
    }
  };

  return new plugin_exchange_sound();
})()