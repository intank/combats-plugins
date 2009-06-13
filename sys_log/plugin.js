(function() {
  return {
    toString: function() {
      return "Лог сообщений Менеджера";
    },
    store: function(eventObj) {
      if (eventObj.mess=='')
        return;
      this.logger.log(eventObj.mess);
    },
    Init: function() {
      if (!combats_plugins_manager.plugins_list['logging'])
        throw new Error('Плагин "logging" должен быть загружен ранее.');

      this.logger = combats_plugins_manager.plugins_list['logging'].createLogger('sys_log','sys_log\\history');
      combats_plugins_manager.attachEvent(
        'log.message',
        combats_plugins_manager.get_binded_method(this,this.store));

      return this;
    }
  }.Init();
})()