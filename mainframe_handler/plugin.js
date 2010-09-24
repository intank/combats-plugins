(function() {
  return {
    toString: function() {
      return "Обработка основного фрейма";
    },
    onloadHandler: function() {
      var eventObj = { 'window': top.combats_plugins_manager.getMainFrame() };
      top.combats_plugins_manager.fireEvent('mainframe.load', eventObj);
    },
    Init: function() {
      top.combats_plugins_manager.getMainFrame().frameElement.attachEvent(
        "onload",
        top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.Init();
})()