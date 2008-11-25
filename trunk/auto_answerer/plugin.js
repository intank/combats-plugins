(function() {
  return {
    extendedMode: false,
    standardResponse: '',
    extendedQuery: '',
    extendedResponse: '',
    extendedQuery_array: [],
    extendedResponse_array: [],
    testLocalRegExp: /<font class="date">[0-9\:]+<\/font> \[<SPAN>([^<]+)<\/SPAN>\] <font color=.*?>(?:private|to) \[\s*(.*?)\s*\] (.*?)<\/font>/,
    testRemoteRegExp: /<FONT style="background-color:#E0E0E0"><font class="date">[0-9\:]+<\/font>! \[<SPAN>([^<]+)<\/SPAN>\] (?:private|to) \[\s*(.*?)\s*\] (.*?)<\/FONT>/,
    conversation_timeout: 180, //3 минуты защиты от флуда
    afk_timeout: 120, // 2 минуты
    ignore_multi: false,
    ignore_remote: true,
    arrExtendedQuery: [],
    skipNames: {},
    names: [],
    active: false,
    sender: null,
    toString: function() {
      return "Автоответчик";
    },
    getProperties: function() {
      var params = [
        { name: "Активен", value: this.active },
        { name: "Расширенный режим", value: this.extendedMode },
        { name: "Стандартный ответ", value: this.standardResponse, type:"textarea"},
        { name: "Расширенный запрос", value: this.extendedQuery},
        { name: "Расширенный ответ", value: this.extendedResponse, type:"textarea"},
        { name: "Тайм-аут беседы (с)", value: this.conversation_timeout },
        { name: "Тайм-аут отсутствия (с)", value: this.afk_timeout },
        { name: "Игнорировать групповые сообщения", value: this.ignore_multi },
        { name: "Игнорировать сообщения из других городов", value: this.ignore_remote }
      ];
      if (this.extendedMode) {
        for (var i=0; i<10; i++) {
          params.push( { name: "Расширенный запрос "+(i+1), value: this.extendedQuery_array[i] || '' } );
          params.push( { name: "Расширенный ответ "+(i+1), value: this.extendedResponse_array[i] || '', type:"textarea" } );
        }
      }
      return params;
    },
    setProperties: function(a) {
      this.active = a[0].value;
      this.standardResponse = a[2].value;
      this.extendedQuery = a[3].value;
      this.extendedResponse = a[4].value;
      this.conversation_timeout = a[5].value;
      this.afk_timeout = a[6].value;
      this.ignore_multi = a[7].value;
      this.ignore_remote = a[8].value;

      if (this.extendedMode) {
        for (var i=0; i<10; i++) {
          this.extendedQuery_array[i] = a[9+i*2].value;
          this.extendedResponse_array[i] = a[10+i*2].value;
          this.save('standardQuery'+i,this.extendedQuery_array[i]);
          this.save('autoResponse'+i,this.enQuoteText(this.extendedResponse_array[i]));
        }
      }
      this.extendedMode = a[1].value;
      
      this.save('standardResponse',this.enQuoteText(this.standardResponse));
      this.save('standardQuery',this.extendedQuery);
      this.save('autoResponse',this.enQuoteText(this.extendedResponse));
      this.save('conversation_timeout',this.conversation_timeout);
      this.save('afk_timeout',this.afk_timeout);
      this.save('ignore_multi',this.ignore_multi.toString());
      this.save('ignore_remote',this.ignore_remote.toString());
      for (var i=0; i<10; i++) {
        this.save('standardQuery'+i,this.extendedQuery_array[i]);
        this.save('autoResponse'+i,this.enQuoteText(this.extendedResponse_array[i]));
      }
      
      this.arrExtendedQuery = this.extendedQuery.toUpperCase().replace(/(?:^\s+|\s+$)/g,'').split(/\s*[,;]\s*/);
      if (this.arrExtendedQuery.length==1 && this.arrExtendedQuery[0]=='')
        this.arrExtendedQuery = [];
      this.arrExtendedQuery_array = [];
      for (var i=0; i<10; i++) {
        this.arrExtendedQuery_array[i] = this.extendedQuery_array[i].toUpperCase().replace(/(?:^\s+|\s+$)/g,'').split(/\s*[,;]\s*/);
        if (this.arrExtendedQuery_array[i].length==1 && this.arrExtendedQuery_array[i][0]=='')
          this.arrExtendedQuery_array[i] = [];
      }
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
      this.extendedQuery = this.load('standardQuery','info');
      this.extendedResponse = this.deQuoteText(this.load('autoResponse','отсутствую (автоответ)'));

      for (var i=0; i<10; i++) {
        this.extendedQuery_array[i] = this.load('standardQuery'+i,'');
        this.extendedResponse_array[i] = this.deQuoteText(this.load('autoResponse'+i,''));
      }

      this.conversation_timeout = parseInt(this.load('conversation_timeout','180'));
      this.afk_timeout = parseInt(this.load('afk_timeout','120'));
      this.ignore_multi = (this.load('ignore_multi','false')=='true');
      this.ignore_remote = (this.load('ignore_remote','true')!='false');
      combats_plugins_manager.attachEvent(
        'onmessage',
        combats_plugins_manager.get_binded_method(this,this.new_message));
      return this;
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
        var match = mess.match(this.testLocalRegExp);
        if (!match && !this.ignore_remote)
          match = mess.match(this.testRemoteRegExp);
        
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
              match[3] = match[3].toUpperCase();
              if (!this.check_extendedQuery(match[3], match[1], { query: this.arrExtendedQuery, response: this.extendedResponse }))
              {
                ok = false;
                if (this.extendedMode) {
                  for(var k=0; k<10; k++) {
                    if (this.check_extendedQuery(match[3], match[1], { query: this.arrExtendedQuery_array[k], response: this.extendedResponse_array[k] })) {
                      ok = true;
                      break;
                    }
                  }
                }
                if (!ok && !(match[1] in this.skipNames)) {
                  this.names.push({private:match[1],message:this.standardResponse});
                }
              }
            }
            this.skipNames[match[1]] = time;
          }
        }
      }

      if (this.names.length>0) {
        this.sendAutoResponse();
      }
    },
    check_extendedQuery: function(phrase, name, params) {
      var ok = false;
      for(var k=0; k<params.query.length; k++) {
        if (phrase.indexOf(params.query[k])>=0) {
          ok=true;
          var echo = params.response.split(/\s*(\n|\r)+\s*/);
          for(var k=0; k<echo.length; k++)
            this.names.push({private:name,message:echo[k]});
          break;
        }
      }
      return ok;
    }
  }.Init();
})()