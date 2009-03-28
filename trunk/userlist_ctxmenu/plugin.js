(function (){
  return {
    toString: function() {
      return "Контекстное меню в списке игроков";
    },

    ctxMenuHandler: function(){
      var eEvent = top.frames['activeusers'].event;
      if (eEvent.srcElement.nodeName!='A' || eEvent.srcElement.innerText=='') return;
      if (true || eEvent.ctrlKey) {
        top.CtrlPress = false;
        var oMenu=top.Chat.Self.CtxMenu();
        oMenu.sLogin = eEvent.srcElement.innerText;
        oMenu.style.visibility = "visible";

        var nLeft = eEvent.screenX-top.screenLeft;
        var nTop = eEvent.screenY-top.screenTop;
        if (nLeft+oMenu.offsetWidth>top.document.body.clientWidth) {
          nLeft = top.document.body.clientWidth - oMenu.offsetWidth;
        }
        if (nTop+oMenu.offsetHeight>top.document.body.clientHeight) {
          nTop = top.document.body.clientHeight - oMenu.offsetHeight;
        }
        
        oMenu.style.left = nLeft+'px';
        oMenu.style.top = nTop+'px';
        oMenu.sTimer = Timer.Add( oMenu,
	  function () {
	    if( this.bMouseOver )
		return;
	    this.nTimeCount++;
	    if( this.nTimeCount > 2 )
		this.Hide( );
	  }, 0.1);
        oMenu.nTimeCount = 0;
        oMenu.bMouseOver = true;
        eEvent.returnValue = false;
        return false;
      }
    },

    Init: function() {
      top.frames['activeusers'].document.body.oncontextmenu = this.ctxMenuHandler;
      return this;
    }
  }.Init();
})()