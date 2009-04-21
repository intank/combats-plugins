(function (){
  return {
    keyCodes: {
      8: 'Backspace',
      9: 'Tab',
      13: 'Enter',
      16: 'Shift',
      17: 'Ctrl',
      18: 'Alt',
      20: 'CapsLock',
      32: 'Space',

      33: 'PgUp',
      34: 'PgDown',
      35: 'End',
      36: 'Home',

      45: 'Ins',
      46: 'Del',

      48: '0',
      49: '1',
      50: '2',
      51: '3',
      52: '4',
      53: '5',
      54: '6',
      55: '7',
      56: '8',
      57: '9',

      65: 'A',
      66: 'B',
      67: 'C',
      68: 'D',
      69: 'E',
      70: 'F',
      71: 'G',
      72: 'H',
      73: 'I',
      74: 'J',
      75: 'K',
      76: 'L',
      77: 'M',
      78: 'N',
      79: 'O',
      80: 'P',
      81: 'Q',
      82: 'R',
      83: 'S',
      84: 'T',
      85: 'U',
      86: 'V',
      87: 'W',
      88: 'X',
      89: 'Y',
      90: 'Z',

      91: 'LeftWin',
      92: 'RightWin',
      93: 'Apps',

      96: 'Num 0',
      97: 'Num 1',
      98: 'Num 2',
      99: 'Num 3',
      100: 'Num 4',
      101: 'Num 5',
      102: 'Num 6',
      103: 'Num 7',
      104: 'Num 8',
      105: 'Num 9',

      106: 'Num *',
      107: 'Num +',
      108: 'Num ???',
      109: 'Num -',
      110: 'Num .',
      111: 'Num /',
      
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',

      144: 'NumLock',
      146: 'ScrollLock',

      187: '+',
      189: '-',
      191: '/',
      192: '`',

      219: '[',
      220: '\\',
      221: ']',
      226: '\\'
    },
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
      this.assignDialogActive = false;
      top.Window.oPrompt.oValue.readOnly = false;
      if (!result) {
        return callback(null);
      }
      callback(result);
    },
    showAssignDialog: function(value, callback) {
      top.Window.Prompt(
        function(result) {
          if (result)
            result = result.replace(/;.*$/,'');
          this.assignDialogHandler(result, callback);
        },
        this,
        'Нажмите желаемую комбинацию клавиш, не пытайтесь править строку ввода',
        value,
        'Назначаем горячую клавишу'
      );
      var parsed = this.parseKeyId(value);
      if (parsed && (parsed.keyCode in this.keyCodes)) {
        value += '; '+(parsed.ctrlKey?'Ctrl+':'')+(parsed.shiftKey?'Shift+':'')+(parsed.altKey?'Alt+':'')+this.keyCodes[parsed.keyCode];
      }
      top.Window.oPrompt.oValue.value = value;
      top.Window.oPrompt.oValue.readOnly = true;
      setTimeout(function(){top.Window.oPrompt.oValue.focus();},10);
      this.assignDialogActive = true;      
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
    setKeyHandler: function(keyCode, ctrlKey, shiftKey, altKey, action, description) {
      if (typeof(keyCode)=='string') {
        var parsed = this.parseKeyId(keyCode);
        if (!parsed)
          return false;
        description = shiftKey;
        action = ctrlKey;
        keyCode = parsed.keyCode;
        ctrlKey = parsed.ctrlKey;
        shiftKey = parsed.shiftKey;
        altKey = parsed.altKey;
      }
      var s = (ctrlKey?'C':'c')+(shiftKey?'S':'s')+(altKey?'A':'a')+'_'+keyCode.toString();
      this.hotKeys[s] = {
        keyCode:keyCode, 
        shiftKey:shiftKey, 
        ctrlKey:ctrlKey, 
        altKey:altKey, 
        action:action,
        description:description};
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
      var s = (ctrlKey?'C':'c')+(shiftKey?'S':'s')+(altKey?'A':'a')+'_'+keyCode.toString();
      if (s in this.hotKeys)
      {
        delete this.hotKeys[s];
      }
    },
    onKeyDownHandler: function(e) {
      try {
        e = e || event || {};
        var s = (e.ctrlKey?'C':'c')+(e.shiftKey?'S':'s')+(e.altKey?'A':'a')+'_'+e.keyCode.toString();
        if (this.assignDialogActive && top.Window.oPrompt.oValue==e.srcElement) {
          if (e.keyCode in this.keyCodes) {
            s += '; '+(e.ctrlKey?'Ctrl+':'')+(e.shiftKey?'Shift+':'')+(e.altKey?'Alt+':'')+this.keyCodes[e.keyCode];
          }
          top.Window.oPrompt.oValue.value = s;
          setTimeout(function(){top.Window.oPrompt.oValue.focus();},10);
          e.cancelBubble = true;
          return;
        }
        if (s in this.hotKeys)
        {
          e.cancelBubble = true;
          this.hotKeys[s].action();
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
      return this;
    }
  }.Init();
  
})()