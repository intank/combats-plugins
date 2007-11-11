(function (){
  var plugin_font_size = function() {
    if (false) {
      top.frames['chat'].frameElement.attachEvent(
        "onload",
        combats_plugins_manager.get_binded_method(this,this.onloadHandler)
      );
    }
    this.fontSize = this.load("fontSize", "11"); // время в секундах до самостоятельного удара
    this.onloadHandler();
  };

  plugin_font_size.prototype = {
    fontSize: "11",
    toString: function() {
      return "Размер шрифта для слепых";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","font_size\\font_size.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","font_size\\font_size.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      return [
        { name: "Размер шрифта", value: this.fontSize }
      ];
    },
    setProperties: function(a) {
      this.fontSize=a[0].value;
      this.save("fontSize",this.fontSize); // время в секундах до самостоятельного удара
      this.onloadHandler();
    },

    processStyleSheet: function(styleSheet) {
      for(var i=0; i<styleSheet.rules.length; i++) {
        var selectorText = styleSheet.rules[i].selectorText;
        if (selectorText.match(/^(SPAN|\.date2?|DIV\.Chat|DIV\.Chat .+)$/)) {
          styleSheet.rules[i].style.fontSize=this.fontSize+"pt";
        }
      }
      for(var i=0; i<styleSheet.imports.length; i++) {
        this.processStyleSheet(styleSheet.imports[i]);
      }
    },

    onloadHandler: function() {
      var styleSheets;
      try {
        styleSheets = top.Chat.Self.arrLogs.oChat.Frame( ).ownerDocument.styleSheets;
      } catch (e) {
        styleSheets = top.frames['chat'].document.styleSheets;
      }
      for(var i=0; i<styleSheets.length; i++) {
        this.processStyleSheet(styleSheets[i]);
      }
    }
  };
  
  var plugin_font_size_object = new plugin_font_size();
  return plugin_font_size_object;
})()