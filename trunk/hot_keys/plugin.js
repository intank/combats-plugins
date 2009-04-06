(function (){
  return {
    hotKeys: [],
    toString: function() {
      return "Горячие клавиши";
    },
    getProperties: function() {
      var handlers = [];
      for(var i in this.hotKeys) {
        handlers.push(
          'keyCode:'+this.hotKeys[i].keyCode+
          ',shiftKey:'+this.hotKeys[i].shiftKey+
          ',ctrlKey:'+this.hotKeys[i].ctrlKey+
          ',altKey:'+this.hotKeys[i].altKey);
      }
      return [
        { name:'Зарегистрированные коды:', value:handlers.join('\n'), type:'textarea' }
      ];
    },
    setProperties: function(a) {
    },
    assignDialogHandler: function(result, callback) {
      this.assignDalogActive = false;
      top.Window.oPrompt.oValue.readOnly = false;
      if (!result) {
        return callback(null);
      }
      callback(result);
    },
    showAssignDialog: function(callback) {
      top.Window.Prompt(
        function(result) {
          this.assignDialogHandler(result, callback);
        },
        this,
        'Нажмите желаемую комбинацию клавиш, не пытайтесь править строку ввода',
        '',
        'Назначаем горячую клавишу'
      );
      top.Window.oPrompt.oValue.readOnly = true;
      this.assignDalogActive = true;
    },
    parseKeyId: function(keyId) {
      if (typeof(keyId)!='string')
        return null;
      var match = keyId.match(/^(C|c)(S|s)(A|a)_(\d+)$/);
      if (!match)
        return null;
      return { 
        keyCode: parseInt(match[4]),
        ctrlKey: (match[1]=='C'),
        shiftKey: (match[2]=='S'),
        altKey: (match[3]=='A')
      };
    },
    setKeyHandler: function(keyCode, ctrlKey, shiftKey, altKey, action) {
      if (typeof(keyCode)=='string') {
        var parsed = this.parseKeyId(keyCode);
        if (!parsed)
          return false;
        action = ctrlKey;
        keyCode = parsed.keyCode;
        ctrlKey = parsed.ctrlKey;
        shiftKey = parsed.shiftKey;
        altKey = parsed.altKey;
      }
      for(var i in this.hotKeys) {
        if (this.hotKeys[i].keyCode==keyCode 
          && this.hotKeys[i].ctrlKey==ctrlKey
          && this.hotKeys[i].shiftKey==shiftKey
          && this.hotKeys[i].altKey==altKey)
        {
          this.hotKeys[i].action = action;
          return true;
        }
      }
      this.hotKeys.push({keyCode:keyCode, shiftKey:shiftKey, ctrlKey:ctrlKey, altKey:altKey, action:action})
      return true;
    },
    removeKeyHandler: function(keyCode, shiftKey, ctrlKey, altKey) {
      if (typeof(keyCode)=='string') {
        var parsed = this.parseKeyId(keyCode);
        if (!parsed)
          return false;
        keyCode = parsed.keyCode;
        ctrlKey = parsed.ctrlKey;
        shiftKey = parsed.shiftKey;
        altKey = parsed.altKey;
      }
      for(var i in this.hotKeys) {
        if (this.hotKeys[i].keyCode==keyCode 
          && this.hotKeys[i].ctrlKey==ctrlKey
          && this.hotKeys[i].shiftKey==shiftKey
          && this.hotKeys[i].altKey==altKey)
        {
          this.hotKeys.splice(i,1);
          return;
        }
      }
    },
    onKeyDownHandler: function(e) {
      try {
        e = e || event || {};
        if (this.assignDalogActive && top.Window.oPrompt.oValue==e.srcElement) {
          var s = '_'+e.keyCode.toString();
          s = (e.altKey?'A':'a')+s;
          s = (e.shiftKey?'S':'s')+s;
          s = (e.ctrlKey?'C':'c')+s;
          top.Window.oPrompt.oValue.value = s;
          e.cancelBubble = true;
          return;
        }
        for(var i in this.hotKeys) {
          if (this.hotKeys[i].keyCode==e.keyCode 
            && this.hotKeys[i].ctrlKey==e.ctrlKey
            && this.hotKeys[i].shiftKey==e.shiftKey
            && this.hotKeys[i].altKey==e.altKey)
          {
            e.cancelBubble = true;
            this.hotKeys[i].action();
            break;
          }
        }
      } catch(ex) {
        top.combats_plugins_manager.add_chat(ex.message);
      }
    },
    mainframeLoad: function(eventObj) {
      this.attachHandlers(eventObj.window);
    },
    attachHandlers: function(w) {
      w.document.attachEvent('onkeydown',
        combats_plugins_manager.get_binded_method(this, this.onKeyDownHandler));
      for(var i=0; i<w.frames.length; i++) {
        this.attachHandlers(w.frames[i]);
      }
    },
    Init: function() {
      this.attachHandlers(top);
      combats_plugins_manager.attachEvent('mainframe.load',
        combats_plugins_manager.get_binded_method(this, this.mainframeLoad))
      this.setKeyHandler( 114, false, false, false, 
        function(){top.cht('/main.pl?edit='+Math.random());} );
      return this;
    }
  }.Init();
  
})()