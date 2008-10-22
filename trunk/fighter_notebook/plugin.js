(function() {
  var plugin_fighter_notebook = {
    itemNotebook: null,
    notesFrame: null,
    fighterData: [],
    toString: function() {
      return "Заметки о бойцах";
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
      for(var i=0; i<matches.length; i++) {
        matches[i] = matches[i].match(/^(.*?)=(.*)$/);
        if (matches[i]) {
          this.fighterData[matches[i][1]]=matches[i][2];
        }
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
    addNote: function() {
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
        +((top.Chat.Self.oCtxMenu.sLogin in this.fighterData)?this.fighterData[top.Chat.Self.oCtxMenu.sLogin].replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'):'')
        +'</textarea><br/><div style="text-align:center"><button>Сохранить</button> <button>Отменить</button></div>';
      var btn = this.notesFrame.lastChild.lastChild;
      btn.onclick = combats_plugins_manager.get_binded_method(this,this.closeNotes);
      btn = btn.previousSibling
      btn.onclick = combats_plugins_manager.get_binded_method(this,this.saveNotes,top.Chat.Self.oCtxMenu.sLogin);
    },
    closeNotes: function() {
      this.notesFrame.style.display = 'none';
    },
    saveNotes: function(sLogin) {
      this.fighterData[sLogin] = this.notesFrame.firstChild.value;
      this.saveToFile();
      this.closeNotes();
    },
    Init: function() {
      top.combats_plugins_manager.attachEvent('fighterContextMenu', 
        top.combats_plugins_manager.get_binded_method(this, this.handlerCtxMenu));
      this.loadFromFile();
    }
  };

  plugin_fighter_notebook.Init();
  return plugin_fighter_notebook;
})()