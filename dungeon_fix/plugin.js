(function() {
  var cpm = top.combats_plugins_manager;
  var $ = top.$;
  return {
    toString: function() {
      return "Исправления подземки";
    },
    onloadHandler: function(eventObj) {
      if (eventObj['window'].location.pathname.search(/^\/dungeon\d*\.pl/)!=0)
        return;
      try {
        var w=eventObj['window'];
        if (!('fastshow2' in w))
          return;
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
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    },
    init: function(){
      cpm.attachEvent(
        'mainframe.load',
        cpm.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.init();
})()