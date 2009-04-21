(function(){
  return {
    toString: function() {
      return 'Быстрый кровавый сбор';
    },
    getProperties: function() {
      return [
        {name:'Задать горячую клавишу', value:this.setHotKey}
      ];
    },
    setProperties: function(a) {
      this.configurator.saveIni('hotKey', this.hotKey.toString());
    },
    setHotKey: function() {
      var hot_keys = combats_plugins_manager.plugins_list['hot_keys'];
      if (!hot_keys)
        return alert('К сожалению, не найден плагин hot_keys.\nНевозможно задать горячую клавишу.');
      hot_keys.showAssignDialog(
        this.hotKey,
        combats_plugins_manager.get_binded_method(
          this,
          function(result) {
            if (result) {
              if (this.hotKey)
                hot_keys.removeKeyHandler(this.hotKey);
              this.hotKey = result;
              hot_keys.setKeyHandler(this.hotKey, combats_plugins_manager.get_binded_method(
                this,
                this.doGather
              ));
            }
          })
      );
    },
    doGather: function() {
      if (!top.Battle.bInBattle || !top.Battle.oBattle)
        return;
      var oMySlot = top.Battle.oBattle.oMySlot;
      for(var slot in {'w6':0,'w7':0,'w8':0}) {
        var arrMagic = oMySlot.GetMagic(slot);
        if (!arrMagic || !arrMagic.length || arrMagic[0].sID!='invoke_create_lesserbloodstone')
          continue;
        oMySlot.arrSlots[slot].click();
        setTimeout(function(){top.Window.oConfirm.oOk.click()},0);
        break;
      }
    },
    Init: function() {
      this.configurator = combats_plugins_manager.createConfigurationElement('battle_bloodring');
      this.hotKey = this.configurator.loadIni('hotKey', '');
      if (this.hotKey) {
        var hot_keys = combats_plugins_manager.plugins_list['hot_keys'];
        if (hot_keys)
          hot_keys.setKeyHandler(this.hotKey, combats_plugins_manager.get_binded_method(
            this,
            this.doGather
          ));
        else
          throw new Error('Не загружен требующийся для работы плагин: <b>hot_keys</b>');
      }

      return this;
    }
  }.Init();
})()