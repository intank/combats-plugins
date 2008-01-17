(function(){
  function plugin_fast_cast() {
    this.init()
  }

  plugin_fast_cast.prototype = {
    inProgress: false,
    castQueue: [],
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","fast_cast\\fast_cast.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","fast_cast\\fast_cast.ini",top.getCookie('battle'),key,val);
    },
    onUnload: function() {
      top.fast_cast.div="";
    },
    toString: function() {
      return "Быстрые заклинания";
    },
    getProperties: function() {
      return [];
    },
    setProperties: function(a) {
    },
    queryName: function(spellName,spellId) {
      top.Window.Prompt(
        function(a){
          if (a) {
            this.castSpell({spellName:spellName,spellId:spellId,target:a});
          }
        },
        this,
        'Для каста заклинания необходимо выбрать цель. Введите ник или щёлкните по нику в чате',
        '',
        'Кастуем "<b>'+spellName+'</b>"'
      );
    },
    sendAutoResponse: function(message) {
      if (!this.sender)
        this.sender = combats_plugins_manager.plugins_list['chat_sender'];
      if (this.sender)
        this.sender.send(message);
    },
    findSpell: function(params) {
      var doc = combats_plugins_manager.getMainFrame().document;
      for (var i=0; i<doc.images.length; i++) {
        if (doc.images[i].src=='http://img.combats.ru/i/items/'+params.spellId+'.gif') {
          var obj = doc.images[i];
          while(obj && obj.tagName!='A')
            obj = obj.nextSibling;
          if (obj && (obj.href.match(/^javascript\:(magicklogin\('(.*?)', .*\))$/)) && match[2]==params.spellName) {
            return obj;
          }
        }
      }
      return null;
    },
    doCast: function(link, params) {
      var doc = link.document;
      var match=obj.href.match(/^javascript\:(magicklogin\('(.*?)', .*\))$/)
      doc.parentWindow.eval(match[1]);
      doc.forms['slform'].elements['param'].value = params.target;
      doc.forms['slform'].submit();
    },
    castSpell: function(params, step) {
      if (!step) {
        if (params.a==top.mylogin) {
          return;
        }
        if (!this.inProgress) {
          this.inProgress = true;
          var link;
          if (link=this.findSpell(params)) {
            this.mainframeload_handler = combats_plugins_manager.get_binded_method(this,this.castSpell,params,2);
            combats_plugins_manager.attachEvent('mainframe.load',this.mainframeload_handler);
            this.doCast(link, params);
          } else {
            this.mainframeload_handler = combats_plugins_manager.get_binded_method(this,this.castSpell,params,1);
            combats_plugins_manager.attachEvent('mainframe.load',this.mainframeload_handler);
            combats_plugins_manager.getMainFrame().location = '/main.pl?edit=2&'+Math.random();
          }
        } else {
          this.castQueue.push(params);
        }
      } else switch (step) {
        case 1:
          if (this['debugger']) debugger;
          combats_plugins_manager.detachEvent('mainframe.load',this.mainframeload_handler);
          var link;
          if (link=this.findSpell(params)) {
            this.mainframeload_handler = combats_plugins_manager.get_binded_method(this,this.castSpell,params,2);
            combats_plugins_manager.attachEvent('mainframe.load',this.mainframeload_handler);
            this.doCast(link, params);
          } else {
            this.sendAutoResponse('private ['+params.target+'] По каким-то причинам я не могу сейчас кастовать :chtoza: (автоответ)');
            this.inProgress = false;
            if (this.castQueue.length>0)
              this.castSpell(this.castQueue.shift());
          }
          break;
        case 2:
          combats_plugins_manager.detachEvent('mainframe.load',this.mainframeload_handler);
          var doc = combats_plugins_manager.getMainFrame().document;
          var castResult = doc.getElementsByTagName('TABLE')[0].cells[1].firstChild;
          if (castResult.nodeName=='FONT' && castResult.currentStyle.color=='red') {
            var congratulations = '';
            if (castResult.innerText.search('Успешно')>-1) {
//              congratulations = ' :superng: С Новым годом!';
            }
            this.sendAutoResponse('private ['+params.target+'] '+castResult.innerText+' (автоответ)'+congratulations);
          } else {
            this.sendAutoResponse('private ['+params.target+'] По каким-то причинам результат каста нераспознан :chtoza: (автоответ)');
          }
          this.inProgress = false;
          if (this.castQueue.length>0)
            this.castSpell(this.castQueue.shift());
          break;
        }
    },
    init: function() {
      top.combats_plugins_manager.plugins_list['top_tray'].addButton({
        'button': {
          'style': {
            'width': "32px",
            'height': "20px",
            'padding': "2px",
            'background': "#505050"
            },
          'onclick': combats_plugins_manager.get_binded_method(
            this, 
            this.queryName, 
            'Жажда Жизни +4',
            'spell_powerHPup4')
          },
        'img': {
          'style': {
            'width': "33px",
            'height': "24px",
            'left': "-2px",
            'top': "-1px",
            'position': "relative",
            'filter': "Glow(color=#DDDDDD,Strength=3,Enabled=0)"
            },
          'onmouseout': function() {
              this.filters.Glow.Enabled=0;
            },
          'onmouseover': function() {
              this.filters.Glow.Enabled=1;
            },
          'src': "file:///"+combats_plugins_manager.base_folder+"fast_cast/mag_.gif",
          'alt': "Быстрые заклинания"
          }
        });
    }
  };

  return new plugin_fast_cast();
})()