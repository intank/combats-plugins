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
  }

  plugin_exchange_sound.prototype = {
    autoAccept: false,
    autoCommit: false,
    toString: function() {
      return "�������� ����������� � ����������� � ��������";
    },
    getProperties: function() {
      return [
        { name:"������������� ������������ �����������", value: this.autoAccept },
        { name:"������������� �������� �� �������", value: this.autoCommit },
        { name:"�������� � ������ ������", value:'' },
        { name:"��������", value:this.addBlackList }
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
    exchangeCompleted: function() {
      if (!this.autoCommit)
        return;

      setTimeout(
        function() {
          try {
            var buttons=combats_plugins_manager.getMainFrame().document.getElementsByTagName('button');
            for(var i=0; i<buttons.length; i++) {
              if (buttons[i].value=='���������') {
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
    exchangeConfirmDlg: function( eventObj ){
      if (this.autoAccept) {
        var match = eventObj.oRoot.text.match(/"(.+)" ����� ��������� � ���� ������/);
        var name = match?match[1]:'';
        if (this.blacklist[name]) {
          setTimeout('top.Window.oConfirm.oCancel.click()',0);
          this.sendAutoResponse('private ['+name+'] �� ��� � ���� ������ ������� ��������! �������� � �����������');
        } else {
          setTimeout('top.Window.oConfirm.oOk.click()',0);
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