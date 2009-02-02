(function(){
  return {
    URL: '',
    knownDiggersLists: {
      BKTorg: 'http://www.bktorg.ru/list?search=',
      DarkLaw: 'http://www.darklaw.ru/diggers.php?act=fast_check&mini_view=1&login='
    },
    oPanel: null,
    oWindow: null,
    div: null,
    iframe: null,
    menuItem: null,
    toString: function() {
      return "Проверка надёжности диггера";
    },
    checkNick: function(login) {
      var oPanel;
      if (!this.iframe) {
        oPanel = this.oPanel = combats_plugins_manager.createWindow("Проверка диггера", 640,480);

        this.div = document.createElement('<div style="width:100%; height:100%;">');
        this.div.innerHTML = '<table style="width:100%; height:100%;"><tr><td><form><input type="text"/><select></select><input type="button" value="Проверить"/></form><tr><td style="width:100%; height:100%;"><iframe style="width:100%; height:100%;"></iframe></table>';
        this.div.firstChild.cells[0].firstChild.onsubmit = this.div.firstChild.cells[0].firstChild.lastChild.onclick = combats_plugins_manager.get_binded_method(this,this.checkNick);
        var select = this.div.firstChild.cells[0].firstChild.firstChild.nextSibling;
        for(var listId in this.knownDiggersLists) {
          var option = document.createElement('option');
          option.innerText = listId;
          option.selected = (this.knownDiggersLists[listId] == this.URL);
          select.options.add(option);
        }
        document.body.appendChild(this.div);
	this.iframe = this.div.firstChild.cells[1].firstChild;
        oPanel.oWindow.Insert( this.div );
      } else {
	oPanel = this.oPanel;
      }
      if (login)
        this.div.firstChild.cells[0].firstChild.firstChild.value = login;
      else
        login = this.div.firstChild.cells[0].firstChild.firstChild.value;
      oPanel.oWindow.Show();
      var select = this.div.firstChild.cells[0].firstChild.firstChild.nextSibling;
      var listId = select.options[select.selectedIndex].innerText;
      if (this.URL!=this.knownDiggersLists[listId]) {
        this.URL = this.knownDiggersLists[listId];
        this.configurator.saveIni('listId',listId);
      }

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
      this.configurator = top.combats_plugins_manager.createConfigurationElement('digger_check');
      this.URL = this.knownDiggersLists[this.configurator.loadIni('listId','')];
      top.combats_plugins_manager.attachEvent('fighterContextMenu', 
        top.combats_plugins_manager.get_binded_method(this, this.handlerCtxMenu));
      return this;
    }
  }.Init();
})()
