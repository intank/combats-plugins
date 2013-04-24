(function() {
  var cpm = top.combats_plugins_manager;
  var $ = top.$;
  return {
    toString: function() {
      return "Скрыть кнопки чата";
    },
    buttons: {},
    getProperties: function(){
      return [
        {name:'Скрыть скорость обновления чата', value:this.hideChatSpeed},
        {name:'Скрыть переключатель транслита', value:this.hideTranslit},
        {name:'Скрыть вызов лича', value:this.hideLich},
        {name:'Скрыть карту города', value:this.hideMap},
        {name:'Скрыть кнопку алхимиков', value:this.hideAlchemists},
        {name:'Скрыть кнопку Пути', value:this.hideAstral},
        {name:'Скрыть кнопку выхода', value:this.hideExit},
        {name:'Поместить скрытые кнопки в разворачивающуюся панель', value:this.showPanelButton}
      ];
    },
    setProperties: function(a){
      this.hideChatSpeed = a[0].value;
      this.hideTranslit = a[1].value;
      this.hideLich = a[2].value;
      this.hideMap = a[3].value;
      this.hideAlchemists = a[4].value;
      this.hideAstral = a[5].value;
      this.hideExit = a[6].value;
      this.showPanelButton = a[7].value;

      this.config.saveIni('hideChatSpeed', ''+this.hideChatSpeed);
      this.config.saveIni('hideTranslit', ''+this.hideTranslit);
      this.config.saveIni('hideLich', ''+this.hideLich);
      this.config.saveIni('hideMap', ''+this.hideMap);
      this.config.saveIni('hideAlchemists', ''+this.hideAlchemists);
      this.config.saveIni('hideAstral', ''+this.hideAstral);
      this.config.saveIni('hideExit', ''+this.hideExit);
      this.config.saveIni('showPanelButton', ''+this.showPanelButton);

      this.applySettings();
    },
    enumerateButtons: function(){
      var buttons = this.buttons;
      $('img', top.frames['bottom'].document).each(function(){
        var match = this.src.toString().match(/\/([^\/\.]+?)(?:_on|_off|)\.(?:gif|png)$/);
        if (match) {
          var buttonId = match[1];
          buttons[buttonId] = this;
        }
      });
    },
    doShowHide: function(hide, img){
      this.buttons[img] && (this.buttons[img].style.display = hide ? 'none' : '');
    },
    applySettings: function(){
      try{
        this.doShowHide(this.hideChatSpeed, 'b___slow');
        this.doShowHide(this.hideTranslit, 'b___translit');
        this.doShowHide(this.hideLich, 'a___lich');
        this.doShowHide(this.hideMap, 'a___map');
        this.doShowHide(this.hideAlchemists, 'a___dlr');
        this.doShowHide(this.hideAstral, 'a___ang');
        this.doShowHide(this.hideExit, 'a___ext');
      }catch(e){
        cpm.logError(this,e);
      }
    },
    init: function(){
      this.enumerateButtons();
      this.config = cpm.createConfigurationElement('hide_chat_buttons');

      this.hideChatSpeed = this.config.loadIni('hideChatSpeed', '')=='true';
      this.hideTranslit = this.config.loadIni('hideTranslit', '')=='true';
      this.hideLich = this.config.loadIni('hideLich', '')=='true';
      this.hideMap = this.config.loadIni('hideMap', '')=='true';
      this.hideAlchemists = this.config.loadIni('hideAlchemists', '')=='true';
      this.hideAstral = this.config.loadIni('hideAstral', '')=='true';
      this.hideExit = this.config.loadIni('hideExit', '')=='true';
      this.showPanelButton = this.config.loadIni('showPanelButton', '')=='true';

      this.applySettings();

      return this;
    }
  }.init();
})()