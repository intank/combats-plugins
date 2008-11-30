(function(){
  return {
    URL: 'http://www.bktorg.ru/list?search=',
//    URL: 'http://www.darklaw.ru/diggers.php?act=fast_check&mini_view=1&login=',
    oPanel: null,
    oWindow: null,
    div: null,
    iframe: null,
    menuItem: null,
    toString: function() {
      return "Проверка надёжности диггера";
    },
    checkNick: function(login) {
      var oConfig;
      if (!this.iframe) {
        this.div = document.createElement('<div style="width:100%; height:100%;">');
        this.div.innerHTML = '<table style="width:100%; height:100%;"><tr><td><form><input type="text"/><input type="button" value="Проверить"/></form><tr><td style="width:100%; height:100%;"><iframe style="width:100%; height:100%;"></iframe></table>';
        this.div.firstChild.cells[0].firstChild.onsubmit = this.div.firstChild.cells[0].firstChild.lastChild.onclick = combats_plugins_manager.get_binded_method(this,this.checkNick);
        
        document.body.appendChild(this.div);

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
	this.iframe = this.div.firstChild.cells[1].firstChild;
        oPanel.oWindow.Insert( this.div );
      } else {
	oPanel = this.oPanel;
      }
      if (login)
        this.div.firstChild.cells[0].firstChild.firstChild.value = login;
      else
        login = this.div.firstChild.cells[0].firstChild.firstChild.value;
      oPanel.oWindow.SetTitle( "Проверка диггера" );
      oPanel.oWindow.SetHook( oPanel, PromptCancel );
      oPanel.oWindow.SizeTo( 640,480 );
      oPanel.oWindow.Show( );
      oPanel.oWindow.SetStyle('Neitral');
      oPanel.oWindow.Align( "1/2", "1/2" );
      this.iframe.src = this.URL+login+"&"+Math.random();
      return false;
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