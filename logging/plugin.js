(function() {
  return {
    logs: {},
    toString: function() {
      return "”правление журналами";
    },
    createLogger: function(loggerName, logsFolder) {
      var plugin = this;
      var filename = '';
      var mess = '';
      var lastCreatedFile = new Date(this.load(loggerName,'lastCreatedFile',(new Date()).toString()));
      this.save(loggerName,'lastCreatedFile',lastCreatedFile.toString());
      writeLogTimer = null;

      var createFilename = function(date) {
        if (!date)
          date = new Date();
        return (logsFolder+'/').replace(/\/{2,}/g,'/')+top.getCookie('battle')+' '+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+' log.html';
      }
      var joinFiles = function() {
        var date = lastCreatedFile;
        var all_mess = '';
        for(var i=0; i<24; i++) {
          date.setHours(i);
          var filename = createFilename(date);
          var mess = plugin.getFile(filename);
          if (mess) {
            var match = mess.match(/<body(?:\s.*?|\s*)>([\s\S]*)$/);
            all_mess += match ? match[1] : mess;
          }
        }
        if (all_mess!='') {
          all_mess = plugin.getHeadFile()+all_mess;
          external.writeFile(combats_plugins_manager.security_id,'Combats.RU',(logsFolder+'/').replace(/\/{2,}/g,'/')+top.getCookie('battle')+' '+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' log.html',all_mess);
        }
      }
      var writeLog = function() {
        if (writeLogTimer)
          clearTimeout(writeLogTimer);
        writeLogTimer = null;
        external.writeFile(combats_plugins_manager.security_id,'Combats.RU',filename,mess);
      }

      joinFiles();

      filename = createFilename();
      mess = plugin.getFile(filename) || plugin.getHeadFile();

      return this.logs[loggerName]={
        log: function(str) {
          var now = new Date();
          if (filename != createFilename()) {
            if (lastCreatedFile.getDate()!=now.getDate()) {
              joinFiles();
            }
            lastCreatedFile = now;
            plugin.save(loggerName,'lastCreatedFile',lastCreatedFile.toString());
            filename = this.createFilename(this.lastCreatedFile);
            mess = plugin.getHeadFile();
          }
          mess += str+"<br/>\n";
          if (writeLogTimer)
            clearTimeout(writeLogTimer);
          writeLogTimer = setTimeout(writeLog, 3000);
        },
        close: function() {
          writeLog();
          delete plugin.logs[loggerName];
        }
      }
    },
    load: function(section,key,def_val) {
      return this.configurator.loadIni(section+'.'+key,def_val);
    },
    save: function(section,key,val) {
      this.configurator.saveIni(section+'.'+key,val);
    },
    getHeadFile: function() {
      return this.getFile('logging/default.html');
    },
    getFile: function(filename) {
      return external.readFile(combats_plugins_manager.security_id,'Combats.RU',filename) || '';
    },
    closeLogs: function() {
      for(var name in this.logs) {
        this.logs[name].close();
      }
    },
    Init: function() {
      this.configurator = combats_plugins_manager.createConfigurationElement('logging');
      top.onunload = combats_plugins_manager.get_binded_method(this,this.closeLogs);
      return this;
    }
  }.Init();
})()