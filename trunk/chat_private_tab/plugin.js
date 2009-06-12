(function(){
  return {
    tabsMadeBetter: false,
    filters: {},
    toString: function() {
      return "Отдельный приватный чат с игроками";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","chat_private_tab\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","chat_private_tab\\settings.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      return [
        { name:'Расширить пространство для вкладок чата', value:this.tabsMadeBetter }
      ];
    },
    setProperties: function(a) {
      if (this.tabsMadeBetter && !a[0].value) {
        this.save('makeTabsBetter', 'false');
        alert('Внешний вид чата будет восстановлен после обновления игрового окна');
      } else if (!this.tabsMadeBetter && a[0].value) {
        this.save('makeTabsBetter', 'true');
        this.makeTabsBetter();
      }
    },
    removePrivateTab: function(oTab, login) {
      if (!top.confirm('Закрыть вкладку привата с "'+login+'"?'))
        return;
      top.Chat.Self.oTab.SelectTab(top.Chat.Self.oTab.arrTabs.chat);
      oTab.Hide();
      for(var i in top.Chat.Self.oTab.arrTabs)
        if (top.Chat.Self.oTab.arrTabs[i]==oTab)
          delete top.Chat.Self.oTab.arrTabs[i];
      var node = oTab.Frame().parentNode
      node.parentNode.removeChild(node);
      oTab.parentNode.removeChild(oTab);
      delete oTab;
      delete this.filters[login];
    },
    addPrivateTab: function(login) {
      if (login in this.filters)
        return;
      top.Chat.Self.CtxMenuHide();
      var oTab = top.combats_plugins_manager.createChatTab('private '+login, login+'&nbsp;<img src="http://img.combats.com/i/clear.gif" style="cursor:pointer">' );
      oTab.firstChild.lastChild.onclick = oTab.ondblclick = top.combats_plugins_manager.get_binded_method(
        this, this.removePrivateTab, oTab, login);
      var filter = this.filters[login] = new RegExp('\\[<SPAN class=p_from>'+login+'<\\/SPAN>\]|<SPAN class=p title=.*?>'+login+'<\\/SPAN>');

      var div = top.Chat.Self.oTab.arrTabs.chat.Frame();
      var msg = div.firstChild;
      var oFrame = oTab.Frame();
      oFrame.style.position = "relative";
      oFrame.style.top = 20;
      oFrame.style.paddingBottom = 25;
      while(msg) {
        msg.filtered_by_plugin_chat_private_tab = true;
        if (msg.innerHTML.match(filter)) {
          var newElement = oFrame.insertBefore(msg.cloneNode(true), null);
          newElement.onclick = msg.onclick;
          newElement.oncontextmenu = msg.oncontextmenu;
        }
        msg = msg.nextSibling;
      }
    },
    closePrivateTab: function(login) {
      // top.Chat.Self.oTab.arrTabs['private '+login];
    },
    onmessage: function(eventObj) {
      setTimeout(top.combats_plugins_manager.get_binded_method(this,this.filter), 100);
    },
    filter: function() {
      var div = top.Chat.Self.oTab.arrTabs.chat.Frame();
      var msg = div.lastChild;
      var privateMessages = {};
      while(msg && !msg.filtered_by_plugin_chat_private_tab) {
        msg.filtered_by_plugin_chat_private_tab = true;
        var innerHTML = msg.innerHTML;
        for (var login in this.filters) {
          if (innerHTML.match(this.filters[login])) {
            if (!privateMessages[login])
              privateMessages[login] = [];
            privateMessages[login].push(msg);
          }
        }
        msg = msg.previousSibling;
      }
      for (var login in privateMessages) {
        var oTab = top.Chat.Self.oTab.arrTabs['private '+login];
        oTab.className = 'TabTextM';
        var oFrame = oTab.Frame();
        while (privateMessages[login].length>0) {
          var msg = privateMessages[login].pop();
          var newElement = oFrame.insertBefore(msg.cloneNode(true), null);
          newElement.onclick = msg.onclick;
          newElement.oncontextmenu = msg.oncontextmenu;
        }
      }
    },
    handlerCtxMenu: function(eventObj) {
      if (!this.menuItem) {
        this.menuItem = top.document.createElement('A');
        top.Chat.Self.oCtxMenu.insertBefore(this.menuItem,top.Chat.Self.oCtxMenu.lastChild.previousSibling);
        this.menuItem.className = 'ChatCtxMenu';
        this.menuItem.href = 'javascript:void(0)';
      }
      this.menuItem.onclick = combats_plugins_manager.get_binded_method(this,this.addPrivateTab,top.Chat.Self.oCtxMenu.sLogin);
      this.menuItem.innerText = 'Приват с "'+top.Chat.Self.oCtxMenu.sLogin+'"';
    },
    makeTabsBetter: function() {
      if (this.tabsMadeBetter) return;
      var tabsDiv = top.Chat.Self.oTab.oLayer.firstChild;
      tabsDiv.style.overflowX='hidden';
      tabsDiv.style.left='0px';
      tabsDiv.style.right='0px';
      tabsDiv.align='left';
      var button = tabsDiv.document.createElement('<button style="width:15px; height:15px; position:absolute; right: 20px; top:5px; padding:0; margin:0; font-size: 6pt">')
      button.innerHTML = '&lt;';
      button.ondblclick = button.onclick = function() {
        top.Chat.Self.oTab.oLayer.firstChild.scrollLeft += 150;
      }
      top.Chat.Self.oTab.oLayer.parentNode.insertBefore(button,top.Chat.Self.oTab.oLayer.nextSibling);
      var button = tabsDiv.document.createElement('<button style="width:15px; height:15px; position:absolute; right: 5px; top:5px; padding:0; margin:0; font-size: 6pt">')
      button.innerHTML = '&gt;';
      button.ondblclick = button.onclick = function() {
        top.Chat.Self.oTab.oLayer.firstChild.scrollLeft -= 150;
      }
      top.Chat.Self.oTab.oLayer.parentNode.insertBefore(button,top.Chat.Self.oTab.oLayer.nextSibling);
      this.tabsMadeBetter = true;
    },
    Init: function() {
      top.combats_plugins_manager.attachEvent('onmessage',
        top.combats_plugins_manager.get_binded_method(this,this.onmessage));
      top.combats_plugins_manager.attachEvent('fighterContextMenu', 
        top.combats_plugins_manager.get_binded_method(this, this.handlerCtxMenu));
      if (this.load('makeTabsBetter','false')=='true')
        this.makeTabsBetter();
      return this;
    }
  }.Init();
})()