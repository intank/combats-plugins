(function(){
  return {
    oPanel: null,
    oWindow: null,
    iframe: null,
    menuItem: null,
    toString: function() {
      return "Проверка надёжности диггера";
    },
    checkNick: function(login) {
      var oConfig;
      if (!this.iframe) {
        this.iframe = document.createElement('<iframe style="width:100%; height:100%;">');
        document.body.appendChild(this.iframe);

        this.oWindow = this.oWindow || top.Window.New( { bNoResize: true } );
        oPanel = this.oPanel = {
	  oWindow: this.oWindow,
	  Class: this,
	  Cancel: function PromptCancel( ) {
	    this.oWindow.Hide( );
	  },
	  SetStyle: function ( sStyle ) {
	    this.oWindow.SetStyle( sStyle );
	  }
        };
      } else {
     	  oPanel = this.oPanel;
      }
      oPanel.oWindow.Insert( this.iframe );
      oPanel.oWindow.SetTitle( "Проверка диггера" );
      oPanel.oWindow.SetHook( oPanel, PromptCancel );
      oPanel.oWindow.SizeTo( 640,480 );
      oPanel.oWindow.Show( );
      oPanel.oWindow.SetStyle('Neitral');
      oPanel.oWindow.Align( "1/2", "1/2" );
      this.iframe.src = "http://www.darklaw.ru/diggers.php?act=fast_check&mini_view=1&login="+login+"&"+Math.random();
    },
    handlerCtxMenu: function(eventObj) {
      if (!this.menuItem) {
        this.menuItem = top.document.createElement('A');
        top.Chat.Self.oCtxMenu.insertBefore(this.menuItem,top.Chat.Self.oCtxMenu.lastChild.previousSibling);
        this.menuItem.className = 'ChatCtxMenu';
        this.menuItem.href = 'javascript:void(0)';
      }
      this.menuItem.onclick = combats_plugins_manager.get_binded_method(this,this.checkNick,top.Chat.Self.oCtxMenu.sLogin);
      this.menuItem.innerText = 'Проверить диггера';
    },
    Init: function() {
      top.combats_plugins_manager.attachEvent('fighterContextMenu', 
        top.combats_plugins_manager.get_binded_method(this, this.handlerCtxMenu));
      return this;
    }
  }.Init();
})()