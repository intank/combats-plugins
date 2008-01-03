(function(){
  plugin_hilight = function(){
    this.setProperties([
      { value: this.load('list','') }
    ]);
  }

  plugin_hilight.prototype = {
    list: '',
    filter: /^$/,
    filterId: '',
    toString: function() {
      return "Игнор-список";
    },
    getProperties: function() {
      return [
        { name: "Список игнорируемых персонажей", value: this.list, type: 'textarea', style: 'width:100%' }
      ];
    },
    setProperties: function(a) {
      try {
        this.list = a[0].value.split(/\s*(?:\n|\r|,|;)+\s+/).join(',');
        this.loadFilters();
        this.save('list',a[0].value);
      } catch (e) {
        alert('Ошибка настройки фильтров: "'+e.message+'"');
      }
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","chat_ignore\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","chat_ignore\\settings.ini",top.getCookie('battle'),key,val);
    },
    loadFilters: function() {
      var filterPlugin = combats_plugins_manager.plugins_list['chat_filter'];
      if (!filterPlugin) {
        throw new Exception('Для корретной работы нужен плагин chat_filter');
      }
      var list = this.list.split(',');
      if (this.filterId!='')
        filterPlugin.removeFilter(this.filterId);
      if (list.length>1 || list[0]!='') {
        this.filterId = filterPlugin.addFilter(
          { filter:new RegExp('(?:!\\s*)?\\[<SPAN>(?:'+list.join('|')+')<\\/SPAN>\\] <font color=".*?">.*?(?:private|to)\\s*\\[(?:[^\\]]*,)?\\s*'+top.mylogin+'\\s*(?:,.*?)?\\]','i'),
            handler:this.clear
          }
        );
      } else {
        this.filterId = '';
      }
    },
    clear: function(match,eventObj) {
      eventObj.mess = '';
    }
  }
  return new plugin_hilight();
})()