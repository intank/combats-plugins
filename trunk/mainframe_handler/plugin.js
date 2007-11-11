(function() {
  plugin_mainframe_handler = function() {
    this.Init();
  }

  plugin_mainframe_handler.prototype = {
    toString: function() {
      return "Обработка основного фрейма";
    },
    onloadHandler: function() {
      var eventObj = { window: top.frames[3] };
      top.combats_plugins_manager.fireEvent('mainframe.load', eventObj);
    },
    Init: function() {
      frames[3].frameElement.attachEvent(
        "onload",
        top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
    }
  };

  return new plugin_mainframe_handler();
})()