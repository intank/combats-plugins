(function() {
  return {
    toString: function() {
      return "Подсветка лучших рун в храме";
    },
    onloadHandler: function() {
      var d = top.combats_plugins_manager.getMainFrame().document;
      if (d.location.pathname!='/rune1.pl')
        return;
      try {
if ($('.headline',d).text() != 'Алтарь Предметов')
  return;
if ($('tr:first-child',d).filter(function(index,element){
  return element.innerText.indexOf('Выбор рун')==0;
}).length<1)
  return;
//        if (/(?:\?|&)c=f&a=d(?:&|$)/.test(d.location.search)) {
	  var levels = [];
	  var bestLevel = 0;
	  var $rows = $('#box > table tr',d);
	  $rows.each(function(index, element){
	    var match = element.innerHTML.match(/(?:&bull;|\u2022)\s*Уровень\:\s*(\d+)/);
	    if (match) {
	      var level = parseInt(match[1]);
	      levels[index] = level;
	      bestLevel = Math.max(level,bestLevel);
	    }
	  });
	  $rows.each(function(index){
	    if (levels[index]==bestLevel)
	      this.style.background = '#D0FFD0';
	  });
//        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    },
    Init: function() {
      top.combats_plugins_manager.attachEvent(
        'mainframe.load',
        top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.Init();
})()
