(function(){
  return {
    preserveChat: true,
    toString: function() {
      return "Управление чатом";
    },
    getProperties: function() {
      return [
        {name:"Сохранять чат при переходах", value: this.preserveChat}
      ];
    },
    setProperties: function(a) {
      this.preserveChat = a[0].value;
      this.config.saveIni('preserveChat', this.preserveChat.toString());
    },
    CLR2: function() {
      if (!this.preserveChat)
        this.oldCLR2.apply(top, []);
    },
    Init: function() {
      this.config = combats_plugins_manager.createConfigurationElement('autopilot');
      this.preserveChat = (this.config.loadIni('preserveChat', 'false') == 'true');
      this.oldCLR2 = top.CLR2;
      top.CLR2 = combats_plugins_manager.get_binded_method(this, this.CLR2);
      return this;
    }
  }.Init();
})()