(function(){
  return {
    positionY: 100,
    toString: function() {
      return "Смещение окна ввода логина";
    },
    Prompt: function(fHandler, oHandler, sText, sValue, sTitle) {
      var oPrompt = this.oldPrompt.apply(top.Window, [fHandler, oHandler, sText, sValue, sTitle]);
      if (oPrompt && top.Battle.bInBattle) {
        oPrompt.oWindow.MoveTo(oPrompt.oWindow.oBodyLayer.offsetParent.offsetLeft,this.positionY);
      }
      return oPrompt;
    },
    Init: function() {
      this.oldPrompt = top.Window.Prompt;
      top.Window.Prompt = combats_plugins_manager.get_binded_method(this, this.Prompt);
      return this;
    }
  }.Init();
})()