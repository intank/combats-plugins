(function(){
  return {
    toString: function() {
      return 'Обновление верхнего фрейма';
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
              hot_keys.setKeyHandler(this.hotKey, 
                combats_plugins_manager.get_binded_method(this,this.doReload),
                this.toString());
            }
          })
      );
    },
    doReload: function() {
      top.frames[3].location = top.frames[3].location.pathname;
    },
    Init: function(){
      this.configurator = combats_plugins_manager.createConfigurationElement('mainframe_reload');
      this.hotKey = this.configurator.loadIni('hotKey', '');
      if (this.hotKey) {
        var hot_keys = combats_plugins_manager.plugins_list['hot_keys'];
        if (hot_keys)
          hot_keys.setKeyHandler(this.hotKey,
            combats_plugins_manager.get_binded_method(this,this.doReload),
            this.toString());
        else
          throw new Error('Не загружен требующийся для работы плагин: <b>hot_keys</b>');
      }

      return this;
    }
  }.Init();
})()