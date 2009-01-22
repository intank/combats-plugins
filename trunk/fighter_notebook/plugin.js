(function() {
  return {
    showNotebookInFriends: true,
    itemNotebook: null,
    notesFrame: null,
    fighterData: [],
    toString: function() {
      return "Заметки о бойцах";
    },
    getProperties: function() {
      return [
        { name: "Добавлять пиктограммы на странице друзей", value: this.showNotebookInFriends }
      ]
    },
    setProperties: function(a) {
      this.showNotebookInFriends = a[0].value;
      this.config.saveIni('showNotebookInFriends', this.showNotebookInFriends.toString());
      if (this.showNotebookInFriends)
        this.hookMainFrameLoad();
      else
        this.unhookMainFrameLoad();
    },
    enQuoteText: function(s) {
      return s.replace(/(\\n)/g,'\\\\n').replace(/\s*[\n\r]+\s*/g,'\\n');
    },
    deQuoteText: function(s) {
      return s.replace(/(^|[^\\])\\n/g,'$1\n').replace(/(\\\\n)/g,'\\n');
    },
    saveToFile: function() {
      s = '';
      for(var login in this.fighterData) {
        s += login+'='+this.enQuoteText(this.fighterData[login])+'\n';
      }
      external.writeFile(combats_plugins_manager.security_id,"Combats.RU","fighter_notebook\\notes.ini",s);
    },
    loadFromFile: function() {
      var s = external.readFile(combats_plugins_manager.security_id,"Combats.RU","fighter_notebook\\notes.ini");
      while (s && !s.slice(-1).charCodeAt(0)) {
        s = s.slice(0,-1);
      }
      s = s || '';
      var matches = s.match(/(?=^|\n)(.*?)=(.*?)(?=$|\n)/gm);
      if (matches) {
        for(var i=0; i<matches.length; i++) {
          matches[i] = matches[i].match(/^(.*?)=(.*)$/);
          if (matches[i]) {
            this.fighterData[matches[i][1]]=matches[i][2];
          }
        }
      }
    },
    mainframeLoad: function(eventObj) {
      var w = combats_plugins_manager.getMainFrame();
      if (w.location.pathname!='/main.pl' || w.document.documentElement.innerHTML.indexOf('<H4>Друзья</H4>')<0)
	return;
      var cell = w.document.getElementsByTagName('TABLE')[1].cells[1];
      friendInfo = cell.firstChild.nextSibling;
      var match;
      var name;
      var isOnline;
      while (friendInfo) {
	if (friendInfo.nodeName=='INPUT')
	  break;
	if (friendInfo.nodeName=='A' && (match=friendInfo.href.match(/javascript\:top\.AddTo\('(.*?)'\)/)))
	  name = match[1];
	if (friendInfo.nodeName=='A' && (match=friendInfo.href.match(/javascript\:top\.AddToPrivate\('(.*?)',.*?\)/)))
	  isOnline = true;
	if (friendInfo.nodeName=='FONT' && (match=friendInfo.innerHTML.match(/<(I|B)>(.*?)<\/\1>/)))
	  name = match[2];
	if (friendInfo.nodeName=='BR' && name) {
	  var node = w.document.createElement('<img src="file:///'+combats_plugins_manager.base_folder+'/fighter_notebook/notebook.gif" alt="Заметки о персонаже &quot;'+name+'&quot;" style="cursor:pointer">');
	  node.onclick = combats_plugins_manager.get_binded_method(this,this.addNote,name);
	  cell.insertBefore(node, friendInfo);
	  name = null;
	}
        friendInfo = friendInfo.nextSibling;
      }
    },
    handlerCtxMenu: function(eventObj) {
      if (!this.itemNotebook) {
        this.itemNotebook = top.document.createElement('A');
        top.Chat.Self.oCtxMenu.insertBefore(this.itemNotebook,top.Chat.Self.oCtxMenu.lastChild.previousSibling);
        this.itemNotebook.className = 'ChatCtxMenu';
        this.itemNotebook.href = 'javascript:void(0)';
        this.itemNotebook.onclick = combats_plugins_manager.get_binded_method(this,this.addNote);
      }
      this.itemNotebook.innerText = 'Заметки о "'+top.Chat.Self.oCtxMenu.sLogin+'"'+((top.Chat.Self.oCtxMenu.sLogin in this.fighterData)?' (читать)':' (создать)');
    },
    addNote: function(sLogin) {
      sLogin = sLogin || top.Chat.Self.oCtxMenu.sLogin;
      if (!this.notesFrame) {
        this.notesFrame = top.document.createElement('DIV');
        this.notesFrame.style.position = 'absolute';
        this.notesFrame.style.left = '25%';
        this.notesFrame.style.width = '50%';
        this.notesFrame.style.top = '25%';
        this.notesFrame.style.height = '50%';
        this.notesFrame.style.background = '#C0C0C0';
        this.notesFrame.style.margin = '10px';
        top.document.body.insertBefore(this.notesFrame, null);
      }
      this.notesFrame.style.display = '';
      this.notesFrame.innerHTML = '<textarea style="width:100%; height:100%">'
        +((sLogin in this.fighterData)?this.fighterData[sLogin].replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'):'')
        +'</textarea><br/><div style="text-align:center"><button>Сохранить</button> <button>Отменить</button></div>';
      var btn = this.notesFrame.lastChild.lastChild;
      btn.onclick = combats_plugins_manager.get_binded_method(this,this.closeNotes);
      btn = btn.previousSibling;
      btn.onclick = combats_plugins_manager.get_binded_method(this,this.saveNotes,sLogin);
    },
    closeNotes: function() {
      this.notesFrame.style.display = 'none';
    },
    saveNotes: function(sLogin) {
      this.fighterData[sLogin] = this.notesFrame.firstChild.value;
      this.saveToFile();
      this.closeNotes();
    },
    hookMainFrameLoad: function() {
      if (!this.mainframeLoadHandler) {
        this.mainframeLoadHandler = top.combats_plugins_manager.get_binded_method(this, this.mainframeLoad);
        top.combats_plugins_manager.attachEvent('mainframe.load', this.mainframeLoadHandler);
      }
    },
    unhookMainFrameLoad: function() {
      if (this.mainframeLoadHandler) {
        top.combats_plugins_manager.detachEvent('mainframe.load', this.mainframeLoadHandler);
        this.mainframeLoadHandler = null;
      }
    },
    Init: function() {
      this.config = combats_plugins_manager.createConfigurationElement('fighter_notebook');
      this.showNotebookInFriends = this.config.loadIni('showNotebookInFriends', 'true')!='false';
      top.combats_plugins_manager.attachEvent('fighterContextMenu', 
        top.combats_plugins_manager.get_binded_method(this, this.handlerCtxMenu));
      if (this.showNotebookInFriends)
        this.hookMainFrameLoad();
      this.loadFromFile();
      return this;
    }
  }.Init();
})()