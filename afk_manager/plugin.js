(function(){
  return {
    refreshTimer: null,
    refreshPeriod: 15,
    toString: function() {
      return "Статус-менеджер";
    },
    getProperties: function() {
      return [
        { name:"Период обновления основного окна", value: this.refreshPeriod }
      ];
    },
    setProperties: function(a) {
      this.refreshPeriod = a[0].value;
      this.save('refreshPeriod',this.refreshPeriod);
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","afk_manager\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","afk_manager\\settings.ini",top.getCookie('battle'),key,val);
    },
    refreshMainFrame: function() {
      try {
        var oReq;
        if (top.XMLHttpRequest) {
          oReq = new top.XMLHttpRequest();
        } else if (window.ActiveXObject) {
          oReq = new ActiveXObject("Microsoft.XMLHTTP");
        } else
          return;

        oReq.open('GET','http://'+top.location.host+'/main.pl?'+Math.random());
        oReq.send('');
      
        this.refreshTimer = setTimeout(
          top.combats_plugins_manager.get_binded_method(this,this.refreshMainFrame),
          this.refreshPeriod*60*1000);
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    },
    onloadHandler: function() {
      try {
        if (this.refreshTimer) {
          clearTimeout(this.refreshTimer);
        }
        this.refreshTimer = setTimeout(
          top.combats_plugins_manager.get_binded_method(this,this.refreshMainFrame),
          this.refreshPeriod*60*1000);
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    },
    Init: function () {
      this.refreshPeriod = parseInt(this.load('refreshPeriod','15'));
      top.combats_plugins_manager.attachEvent('mainframe.load',
        top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.Init();
})()