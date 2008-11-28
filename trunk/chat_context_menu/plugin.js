(function(){
  return {
    original_CtxMenu: top.Chat.Self.CtxMenu,
    toString: function() {
      return 'Контекстное меню бойца';
    },
    CtxMenu: function() {
      var result = this.original_CtxMenu.apply(top.Chat.Self,[]);
      setTimeout(
        combats_plugins_manager.get_binded_method(
          this,
          function(){ combats_plugins_manager.fireEvent('fighterContextMenu', this); }
        ), 
        0
      );
      return result;
    },
    Init: function() {
      top.Chat.Self.CtxMenu = combats_plugins_manager.get_binded_method(this, this.CtxMenu);
      return this;
    }
  }.Init();
})()