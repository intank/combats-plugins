(function() {
  return {
    toString: function() {
      return "Сохранение состояния награды";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","view_reward\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","view_reward\\settings.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      return [
        { name:"Что мы имеем?", value: decodeURIComponent(this.load('state', '')), type: 'textarea' }
      ];
    },
    onloadHandler: function() {
      var d = top.combats_plugins_manager.getMainFrame().document;
      if (d.location.pathname != '/dungeon.pl') return;
      var children = d.getElementsByTagName('FIELDSET')[0].children;
      if (children.length==2 && children[0].nodeName=="LEGEND" && /^Награда\:/.test(children[0].innerText)) {
        this.save('state', encodeURIComponent(children[0].innerText + "\r\n" + children[1].innerText));
      }
    },

    Init: function() {
      top.combats_plugins_manager.attachEvent(
        "mainframe.load",
        combats_plugins_manager.get_binded_method(this,this.onloadHandler)
      );
      this.onloadHandler();
      return this;
    }
  }.Init();
})()