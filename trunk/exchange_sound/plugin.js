(function() {
  plugin_exchange_sound = function() {
    top.combats_plugins_manager.attachEvent('exchange.confirm',
      top.combats_plugins_manager.get_binded_method(this,this.exchangeConfirm));
    top.combats_plugins_manager.attachEvent('exchange.confirmDlg',
      top.combats_plugins_manager.get_binded_method(this,this.exchangeConfirmDlg));
    top.combats_plugins_manager.attachEvent('exchange.completed',
      top.combats_plugins_manager.get_binded_method(this,this.exchangeCompleted));
  }

  plugin_exchange_sound.prototype = {
    autoAccept: true,
    autoCommit: true,
    toString: function() {
      return "Звуковое уведомление о приглашении в передачи";
    },
    getProperties: function() {
      return [
        { name:"Автоматически подтверждать приглашение", value: this.autoAccept },
        { name:"Автоматически выходить из передач", value: this.autoCommit }
      ];
    },
    exchangeCompleted: function() {
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
    setProperties: function(a) {
      this.autoAccept=a[0].value;
    },
    exchangeConfirm: function( ){
      this.snotify(1,'nocheck');
    },
    exchangeConfirmDlg: function( ){
      if (this.autoAccept)
        setTimeout('top.Window.oConfirm.oOk.click()',0);
    },
    snotify: function( sid, chk ) {
      var volume=top.frames['bottom'].soundvol;
      top.frames['bottom'].window.document.Sound.SetVariable("Volume", (volume*50));
      top.frames['bottom'].window.document.Sound.SetVariable("Sndplay",sid);
    }
  };

  return new plugin_exchange_sound();
})()