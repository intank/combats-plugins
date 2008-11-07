(function() {
  return {
    ChatDelay: 10,
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","chat_speed\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","chat_speed\\settings.ini",top.getCookie('battle'),key,val);
    },
    toString: function() {
      return "Скорость обновления чата";
    },
    getProperties: function() {
      return [
        {'name':'Период обновления чата', 'value':this.ChatDelay}
      ];
    },
    apply: function(a) {
      this.ChatDelay = a[0].value;
      if (!this.ChatDelay || this.ChatDelay<5)
        this.ChatDelay = 5;
      if (top.ChatDelay == top.ChatNormDelay) {
        top.ChatNormDelay = this.ChatDelay;
      } else {
        top.ChatDelay = top.ChatNormDelay = this.ChatDelay;
      }
    },
    setProperties: function(a) {
      this.apply(a);
      this.save('ChatDelay', this.ChatDelay);
    },
    Init: function() {
      this.apply([{value: parseFloat(this.load('ChatDelay', '10'))}]);
      return this;
    }
  }.Init();
})()