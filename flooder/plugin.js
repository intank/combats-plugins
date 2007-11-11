(function () {
  plugin_flooder = function () {
    this.load = function(sect,key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","flooder\\flooder.ini",sect,key,def_val);
    };
    this.save = function(sect,key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","flooder\\flooder.ini",sect,key,val);
    }
    this.phrases = [''];
    var i=0;
    do {
      var s=this.load(location.host,"msg"+i,"");
      if (s)
        this.phrases[i++] = s;
      else
        break;
    } while (true);
    if(isNaN(this.period=parseInt(this.load(location.host,"Timeout","200"))))
      this.period=200;
    else if(this.period<15)
      this.period=15;
    this.active=false;
    top.frames["bottom"].document.all["text"].maxLength=65535;
    this.toString = function() {
      return "Автофлудер";
    }
    this.sender = combats_plugins_manager.plugins_list['chat_sender'];
  };

  plugin_flooder.prototype = {
    getProperties: function() {
      return [
        { name: "Фраза", value: this.phrases.join('\n'), type:"textarea"},
        { name: "Отправить сейчас", value: this.exec },
        { name: "Период", value: this.period },
        { name: "Активен", value: this.active }
      ];
    },
    setProperties: function(a) {
      this.phrases = a[0].value.split('\r\n');
      this.period=a[2].value;
      this.active=a[3].value;
      for(var i=0; i<this.phrases.length; i++) {
        this.save(location.host,"msg"+i,this.phrases[i]);
      }
      this.save(location.host,"Timeout",""+this.period);
      if (this.timer!=null)
        clearTimeout(this.timer);
      if (this.active) { // запустить флуд
        this.timer = setTimeout(combats_plugins_manager.get_binded_method(this,this.autoFlood),this.period*1000);
      } else {
        this.timer = null;
      }
    },
    enableFlood: function() {
      if (this.timer!=null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.active)
        this.timer = setTimeout(combats_plugins_manager.get_binded_method(this,this.autoFlood),this.period*1000);
    },
    autoFlood: function() {
      this.exec();
    },
    exec: function() {
      if (this.timer!=null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      var i=this.phrases.length-1-Math.floor(Math.sqrt(Math.random()*Math.pow(this.phrases.length,2)));
      this.sender.send(
        this.phrases[i],
        this.active?combats_plugins_manager.get_binded_method(this,this.enableFlood):null);
      return true;
    }
  };

  return new plugin_flooder();
})()