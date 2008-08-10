(function(){

  var plugin_chat_private_tab = {
    filters: {},
    toString: function() {
      return "Отдельный приватный чат с игроками";
    },
    removePrivateTab: function(oTab, login) {
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
      var oTab = top.Chat.Self.oTab.arrTabs['private '+login] = top.Chat.Self.oTab.AddTab( "private "+login, login );
      oTab.ondblclick = top.combats_plugins_manager.get_binded_method(
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
        var oFrame = top.Chat.Self.oTab.arrTabs['private '+login].Frame();
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
        top.Chat.Self.oCtxMenu.insertBefore(this.menuItem,top.Chat.Self.oCtxMenu.lastChild);
        this.menuItem.className = 'ChatCtxMenu';
        this.menuItem.href = 'javascript:void(0)';
      }
      this.menuItem.onclick = combats_plugins_manager.get_binded_method(this,this.addPrivateTab,top.Chat.Self.oCtxMenu.sLogin);
      this.menuItem.innerText = 'Приват с "'+top.Chat.Self.oCtxMenu.sLogin+'"';
    },
    Init: function() {
      top.combats_plugins_manager.attachEvent('onmessage',
        top.combats_plugins_manager.get_binded_method(this,this.onmessage));
      top.combats_plugins_manager.attachEvent('fighterContextMenu', 
        top.combats_plugins_manager.get_binded_method(this, this.handlerCtxMenu));
    }
  }
  plugin_chat_private_tab.Init();
  return plugin_chat_private_tab;
})()