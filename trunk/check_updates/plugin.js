(function(){
  var CPM = top.combats_plugins_manager;
  return {
    checkScriptURL: 'http://combats-plugins.googlecode.com/svn/trunk/check_updates/',
    period: 2,
    forceCheck: false,
    toString: function() { // Название плагина
      return "Проверка обновлений";
    },
    getProperties: function() { // запрос конфигурируемых параметров
      var choices = {
        'length': 5,
        '0': 'Отключено',
        '1': 'При каждом входе',
        '2': 'Каждый день',
        '3': 'Каждую неделю',
        '4': 'Каждый месяц',
        'selected': this.period
      }
      return [
        {name:"Период проверки", value:choices},
        {name:"Проверить сейчас", value:function(){this.forceCheck=true;this.checkUpdates()}}
      ];
    },
    setProperties: function(a) { // применение изменённых настроек
      this.period = parseInt(a[0].value.selected);
      this.config.saveIni('period', this.period.toString());
    },
    checkUpdates: function() {
      this.lastCheck = new Date().toUTCString();
      this.config.saveIni('lastCheck', this.lastCheck);
      document.body.insertBefore(document.createElement('<script type="text/javascript" src="'+this.checkScriptURL+'check.js">'));
    },
    hasUpdate: function(msg){
      CPM.add_chat(msg);
      this.forceCheck = false;
    },
    noUpdates: function(){
      this.forceCheck && CPM.add_chat('<i>Новых версий нет.</i>');
      this.forceCheck = false;
    },
    Init: function() {
      this.config = CPM.createConfigurationElement('check_updates');
      this.period = parseInt(this.config.loadIni('period', '2')) || 2;
      this.lastCheck = this.config.loadIni('lastCheck', '');
      setTimeout(CPM.get_binded_method(this,function(){
        switch (this.period) {
        case 1:
          this.checkUpdates();
          break;
        case 2:
          if (!this.lastCheck || (new Date().valueOf() - new Date().valueOf(this.lastCheck) > 24*60*60*1000)) {
            this.checkUpdates();
          }
          break;
        case 3:
          if (!this.lastCheck || (new Date().valueOf() - new Date().valueOf(this.lastCheck) > 7*24*60*60*1000)) {
            this.checkUpdates();
          }
          break;
        case 4:
          if (!this.lastCheck || (new Date().valueOf() - new Date().valueOf(this.lastCheck) > 30*24*60*60*1000)) {
            this.checkUpdates();
          }
          break;
        }
      }),500);
      return this;
    }
  }.Init();
})()