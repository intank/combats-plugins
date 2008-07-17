(function() {
  function plugin_chat_log() {
    this.Init();
  }

  plugin_chat_log.prototype = {
    standardResponse: '',
    standardQuery: '',
    autoResponse: '',
    testRegExp: /<font class="date">[0-9\:]+<\/font> \[<SPAN>([^<]+)<\/SPAN>\] <font color=.*?>(?:private|to) \[\s*(.*?)\s*\] (.*?)<\/font>/,
    conversation_timeout: 180, //3 минуты защиты от флуда
    afk_timeout: 120, // 2 минуты
    ignore_multi: false,
    arrStandardQuery: [],
    skipNames: {},
    names: [],
    active: false,
    sender: null,
    toString: function() {
      return "Автоответчик";
    },
    getProperties: function() {
      return [
        { name: "Активен", value: this.active },
        { name: "Стандартный ответ", value: this.standardResponse, type:"textarea"},
        { name: "Стандартный запрос", value: this.standardQuery},
        { name: "Расширенный ответ", value: this.autoResponse, type:"textarea"},
        { name: "Тайм-аут беседы (с)", value: this.conversation_timeout },
        { name: "Тайм-аут отсутствия (с)", value: this.afk_timeout },
        { name: "Игнорировать групповые сообщения", value: this.ignore_multi }
      ];
    },
    setProperties: function(a) {
      this.active = a[0].value;
      this.standardResponse = a[1].value;
      this.standardQuery = a[2].value;
      this.autoResponse = a[3].value;
      this.conversation_timeout = a[4].value;
      this.afk_timeout = a[5].value;
      this.ignore_multi = a[6].value;
      
      this.save('standardResponse',this.enQuoteText(this.standardResponse));
      this.save('standardQuery',this.standardQuery);
      this.save('autoResponse',this.enQuoteText(this.autoResponse));
      this.save('conversation_timeout',this.conversation_timeout);
      this.save('afk_timeout',this.afk_timeout);
      this.save('ignore_multi',this.ignore_multi);
      
      this.arrStandardQuery = this.standardQuery.toUpperCase().replace(/(?:^\s+|\s+$)/g,'').split(/\s*[,;]\s*/);
      if (this.arrStandardQuery.length==1 && this.arrStandardQuery[0]=='')
        this.arrStandardQuery = [];
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","auto_answerer\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","auto_answerer\\settings.ini",top.getCookie('battle'),key,val);
    },
    enQuoteText: function(s) {
      return s.replace(/(\\n)/g,'\\\\n').replace(/\s*[\n\r]+\s*/g,'\\n');
    },
    deQuoteText: function(s) {
      return s.replace(/(^|[^\\])\\n/g,'$1\n').replace(/(\\\\n)/g,'\\n');
    },
    Init: function() {
      this.lastMyActivity = (new Date()).getTime();
      top.document.body.attachEvent(
        'onmousemove',
        combats_plugins_manager.get_binded_method(this,this.mouseMove));
      combats_plugins_manager.attachEvent(
        'mainframe.load',
        combats_plugins_manager.get_binded_method(this,this.mouseMove));
      this.standardResponse = this.deQuoteText(this.load('standardResponse','отсутствую (автоответ)'));
      this.standardQuery = this.load('standardQuery','info');
      this.autoResponse = this.deQuoteText(this.load('autoResponse','отсутствую (автоответ)'));
      this.conversation_timeout = parseInt(this.load('conversation_timeout','180'));
      this.afk_timeout = parseInt(this.load('afk_timeout','120'));
      this.ignore_multi = (this.load('ignore_multi','false')=='true');
      combats_plugins_manager.attachEvent(
        'onmessage',
        combats_plugins_manager.get_binded_method(this,this.new_message));
    },
    mouseMove: function() {
      this.lastMyActivity = (new Date()).getTime();
    },
    sendAutoResponse: function() {
      if (this.names.length<=0)
        return;
      if (!this.sender)
        this.sender = combats_plugins_manager.plugins_list['chat_sender'];
      if (this.sender) {
        var m;
        while (m=this.names.shift()) {
          this.sender.send('private ['+m.private+'] '+m.message);
        }
      }
      this.names = [];
    },
    new_message: function(eventObj) {
      var time = (new Date()).getTime();

      if (!this.active || eventObj.mess=='')
        return;

      for(var name in this.skipNames)
        if (this.skipNames[name] && time-this.skipNames[name]>this.conversation_timeout*1000) // защита от флуда
          delete this.skipNames[name];

      var afk = (time-this.lastMyActivity)>this.afk_timeout*1000;
      var messages = eventObj.mess.split(/<BR>/);
      var mylogin = top.mylogin.toLocaleUpperCase();
      for(var i=0; i<messages.length; i++) {
        var mess = messages[i];
        var match = mess.match(this.testRegExp);
        
        if (match && match[1]!=top.mylogin && !match[1].match(/^klan(?:-\d)?$/)) {
          var ok = false;

          var charlist = match[2].toLocaleUpperCase().split(/\s*,\s*/);
          for(var j=0; j<charlist.length; j++) {
            if (this.ignore_multi && charlist[j]!=mylogin)
              break;
            if (charlist[j]==mylogin) {
              ok = true;
              break;
            }
          }

          if (ok) {
            if (afk) {
              ok=false;
              match[3] = match[3].toUpperCase();
              for(var k=0; k<this.arrStandardQuery.length;k++) {
                if (match[3].indexOf(this.arrStandardQuery[k])>=0) {
                  ok=true;
                  break;
                }
              }
              if (ok) {
                var echo = this.autoResponse.split(/\s*(\n|\r)+\s*/);
                for(var k=0; k<echo.length; k++)
                  this.names.push({private:match[1],message:echo[k]});
              } else if (!(match[1] in this.skipNames)) {
                this.names.push({private:match[1],message:this.standardResponse});
              }
            }
            this.skipNames[match[1]] = time;
          }
        }
      }

      if (this.names.length>0) {
        this.sendAutoResponse();
      }
    }
  };

  return new plugin_chat_log();
})()