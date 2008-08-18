(function(){
  var plugin_claims_filter = {
    minLevel: null,
    maxLevel: null,
    maxAge: null,

    toString: function() {
      return 'Фильтрация заявок';
    },

    getProperties: function() {
      return [
        { name: 'Минимальный уровень', value: this.minLevel===null?'':(''+this.minLevel) },
        { name: 'Максимальный уровень', value: this.maxLevel===null?'':(''+this.maxLevel) },
        { name: 'Максимальный возраст заявки (минут)', value: this.maxAge===null?'':(''+this.maxAge) }
      ];
    },

    setProperties: function(a) {
      this.minLevel = parseInt(a[0].value);
      this.minLevel = isNaN(this.minLevel)?null:this.minLevel;
      this.maxLevel = parseInt(a[1].value);
      this.maxLevel = isNaN(this.maxLevel)?null:this.maxLevel;
      this.maxAge = parseInt(a[2].value);
      this.maxAge = isNaN(this.maxAge)?null:this.maxAge;

      this.save('minLevel',this.minLevel===null?'':(''+this.minLevel));
      this.save('maxLevel',this.maxLevel===null?'':(''+this.maxLevel));
      this.save('maxAge',this.maxAge===null?'':(''+this.maxAge));
    },

    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","claims_filter\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","claims_filter\\settings.ini",top.getCookie('battle'),key,val);
    },

    onload_handler: function(event_obj) {
      if (event_obj.window.location.pathname!='/zayavka.pl')
        return;
      if (true) { // if (/(?:^|\?)level=dgv(?:&|$)/.test(event_obj.window.location.search)) {
        var inputs = event_obj.window.document.forms['F1'].elements;
        var match;
        for(var i=0; i<inputs.length; i++) {
          if (inputs[i].name!='gocombat')
            continue;
          var do_hide = false;
          
          for(var obj = inputs[i].nextSibling; obj && obj.nodeName!='BR'; obj = obj.nextSibling) {
            if (obj.nodeName!='SCRIPT')
              continue;
            if (!(match=obj.innerHTML.match(/drwfl\(".*?",.*?,"(.*?)",.*?,".*?"\)/)))
              continue;
            if (this.minLevel!==null && parseInt(match[1])<this.minLevel || this.maxLevel!==null && parseInt(match[1])>this.maxLevel) {
              var nextSibling;
              for(obj = inputs[i]; obj && obj.nodeName!='BR'; ) {
                nextSibling = obj.nextSibling;
                obj.parentNode.removeChild(obj);
                obj = nextSibling;
              }
              if (obj)
                obj.parentNode.removeChild(obj);
              i--;
              break;
            }
          }
        }
      }
    },

    Init: function() {
      this.setProperties([
        {value:this.load('minLevel','')},
        {value:this.load('maxLevel','')},
        {value:this.load('maxAge','')}
      ]);
      top.combats_plugins_manager.attachEvent('mainframe.load',
        top.combats_plugins_manager.get_binded_method(this, this.onload_handler));
    }
  };

  plugin_claims_filter.Init();
  return plugin_claims_filter;
})()