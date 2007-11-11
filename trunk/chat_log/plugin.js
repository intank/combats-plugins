(function() {
  function plugin_chat_log() {
    this.Init();
  }

  plugin_chat_log.prototype = {
    toString: function() {
      return "Ћог чата";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","chat_log\\chat_log.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","chat_log\\chat_log.ini",top.getCookie('battle'),key,val);
    },
    getHeadFile: function(){
      return external.readFile(combats_plugins_manager.security_id,'Combats.RU','chat_log/default.html');
    },
    joinFiles: function() {
      var date = this.lastCreatedFile;
      var all_mess = '';
      for(var i=0; i<24; i++) {
        date.setHours(i);
        var filename = this.createFilename(date);
        var mess = external.readFile(combats_plugins_manager.security_id,'Combats.RU',filename);
        if (mess) {
          var pos = mess.indexOf('<body>');
          if (pos>=0)
            pos += 6;
          all_mess += mess.substr(pos);
        }
      }
      if (all_mess!='') {
        all_mess = this.getHeadFile()+all_mess;
        external.writeFile(combats_plugins_manager.security_id,'Combats.RU','chat_log/history/'+top.getCookie('battle')+' '+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' log.html',all_mess);
      }
    },
    createFilename: function(date) {
      if (!date)
        date = new Date();
      return 'chat_log/history/'+top.getCookie('battle')+' '+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+' log.html';
    },
    Init: function() {
      this.lastCreatedFile = new Date(this.load('lastCreatedFile',(new Date()).toString()));
      this.joinFiles();
      this.save('lastCreatedFile',this.lastCreatedFile.toString());

      this.filename = this.createFilename();
      this.mess = external.readFile(combats_plugins_manager.security_id,'Combats.RU',this.filename);
      if (typeof(this.mess)=='undefined' || this.mess=='')
        this.mess = this.getHeadFile();

      combats_plugins_manager.attachEvent(
        'onmessage',
        combats_plugins_manager.get_binded_method(this,this.store));
    },
    store: function(eventObj) {
      if (eventObj.mess=='')
        return;
      var now = new Date();
      if (this.filename != this.createFilename()) {
        if (this.lastCreatedFile.getDate()!=now.getDate()) {
          this.joinFiles();
        }
        this.lastCreatedFile = now;
        this.save('lastCreatedFile',this.lastCreatedFile.toString());
        this.filename = this.createFilename(this.lastCreatedFile);
        this.mess = this.getHeadFile();
      }
      this.mess += eventObj.mess+"<br/>\n";
      external.writeFile(combats_plugins_manager.security_id,'Combats.RU',this.filename,this.mess);
    }
  };

  return new plugin_chat_log();
})()