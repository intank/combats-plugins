(function(){
  var obj = {
    ignoreDisabledMethod: true,
    shortcuts: {
      49: 'spirit_block25'
    },
    toString: function() {
      return 'Быстрые боевые приёмы';
    },
    getProperties: function() {
      var s = '';
      for(var i in this.shortcuts) {
        if (this.shortcuts[i]) {
          s += String.fromCharCode(i)+': '+this.shortcuts[i]+'\n';
        }
      }
      return [
        { name:'Приёмы', value:s, type:'textarea' },
        { name:'Использовать недоступные приёмы', value:this.ignoreDisabledMethod }
      ];
    },
    setProperties: function(a) {
      var shortcuts = {};
      var lines = a[0].value.split(/[\n\r]+/);
      for(var i=0;i<lines.length;i++) {
        var match=lines[i].match(/^\s*(\d+)\s*\:\s*(.+?)\s*$/);
        if (match) {
          shortcuts[match[1].charCodeAt(0)] = match[2];
        }
      }
      this.shortcuts = shortcuts;
      this.ignoreDisabledMethod = a[1].value;
    },
    init: function() {
      top.document.onkeydown = top.combats_plugins_manager.get_binded_method(this,this.keydown);
    },
    keydown: function(e) {
      if (!top.Battle.bInBattle)
        return;
      e = e||top.event;
      if (e.srcElement && e.srcElement.nodeName=='INPUT' && e.srcElement.type=='text')
        return;
      if (this['debug'])
        alert(e.keyCode in this.shortcuts);
      if (e.keyCode in this.shortcuts) {
        if (this['debug'])
          alert(this.shortcuts[e.keyCode]);
        this.method = top.Battle.oBattle.arrMethods[this.shortcuts[e.keyCode]];
        if (!this.method) {
          top.combats_plugins_manager.logError(this,new Error('недоступный приём['+e.keyCode+']: '+this.shortcuts[e.keyCode]));
          return;
        }
        
        if (this['debug'])
          alert(typeof(this.method));
        if (typeof(this.method)=='object' && (this.ignoreDisabledMethod || this.method.oMethod.bEnable))
          top.Battle.oBattle.ApplyMethod(this.method.oMethod);
      }
    }
  };
  obj.init();
  return obj;
})()