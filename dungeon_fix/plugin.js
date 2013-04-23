(function() {
  var cpm = top.combats_plugins_manager;
  var $ = top.$;
  return {
    toString: function() {
      return "Исправления подземки";
    },
    getProperties: function(){
      return [
        {name:'Исправлять подсказку на разбросанных вещах', value:this.fixDropHint},
        {name:'Убрать подсказку на кнопке "Обновить"', value:this.hideRefreshHint}
      ];
    },
    setProperties: function(a){
      this.fixDropHint = a[0].value;
      this.hideRefreshHint = a[1].value;
      this.config.saveIni('fixDropHint', ''+this.fixDropHint);
      this.config.saveIni('hideRefreshHint', ''+this.hideRefreshHint);
    },
    onloadHandler: function(eventObj) {
      if (eventObj['window'].location.pathname.search(/^\/dungeon\d*\.pl/)!=0)
        return;
      try {
        var w=eventObj['window'];
        if (this.fixDropHint && ('fastshow2' in w)) {
          var oldFastShow = w.fastshow2;
          w.fastshow2 = function(content,eEvent){
            var result = oldFastShow.apply(w,[content,eEvent]);
            if (!eEvent) eEvent = w.event;
            var obj = (eEvent.target || eEvent.srcElement);
            if (obj.tagName!='AREA' && obj.tagName!='MAP'){
              var mmoves = w.document.getElementById("mmoves");
              var left = $(obj).offset().left + $(obj).width() + 3;
              var top = $(obj).offset().top;
              mmoves.style.position = 'absolute';
              mmoves.style.left = left + 'px';
              mmoves.style.top = top + 'px';
            }
            return result;
          }
        }
        if (this.hideRefreshHint) {
          $('#MoveMap area[onmousemove]',w.document).removeAttr('onmousemove');
        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    },
    init: function(){
      this.config = cpm.createConfigurationElement('dungeon_fix');
      this.fixDropHint = this.config.loadIni('fixDropHint','')=='true';
      this.hideRefreshHint = this.config.loadIni('hideRefreshHint','')=='true';
      cpm.attachEvent(
        'mainframe.load',
        cpm.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.init();
})()