(function(){
  function plugin_fast_cast() {
    this.init()
  }

  plugin_fast_cast.prototype = {
    cast_myself: false,
    knownSpells: [
      { item:'spell_powerHPup5', name:'Жажда Жизни +5', filter:'5' },
      { item:'spell_powerHPup4', name:'Жажда Жизни +4', filter:'4', requirements: {'Интеллект: ':70} },
      { item:'spell_powerup10', name:'Сокрушение', filter:'Сокрушение', requirements: {'Интеллект: ':15} },
      { item:'spell_stat_intel', name:'Холодный Разум', filter:'Холодный Разум', requirements: {'Интеллект: ':70} },
      { item:'cure_g1', name:'Цепь Исцеления', filter:'Цепь Исцеления' },
      { item:'d_blat-6', name:'Пропуск Забытых', filter:'Пропуск Забытых', requirements: {'Интеллект: ':5} }
    ],
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
      return [{'name':'Разрешить кастовать на себя', 'value':this.cast_myself}];
    },
    setProperties: function(a) {
      this.cast_myself = a[0].value;
    },
    selectCast: function() {
      if (this.menu) {
        this.menu.parentNode.removeChild(this.menu);
        this.menu = null;
        return;
      }
      this.menu = top.document.createElement('div');
      var s = '';
      for(var i=0; i<this.knownSpells.length; i++) {
        s += '<tr><td style="width:100%; height: 40px; padding-left:50px; background: center left url(http://img.combats.ru/i/items/'+this.knownSpells[i].item+'.gif) no-repeat; cursor: pointer; font-weight: bold; vertical-align: middle">'+this.knownSpells[i].name+'</td></tr>';
      }
      this.menu.innerHTML = '<table style="border: 2px solid black; width: 100%">'+s+'</table>';
      this.menu.style.cssText = 'position: absolute; z-index: 5; left: '+(window.event.clientX-window.event.offsetX)+'px; top: '+(window.event.clientY-window.event.offsetY+30)+'px; width: 200px; height: auto; background: #C7C7C7';
      top.document.body.insertBefore(this.menu);
      this.menu.attachEvent(
        'onclick',
        combats_plugins_manager.get_binded_method(
          this, 
          function() {
            if (this['debugger']) debugger;
            var i = window.event.srcElement.parentNode.rowIndex;
            if (typeof(i)=='number') {
              this.queryName(i);
              this.menu.parentNode.removeChild(this.menu);
              this.menu = null;
            }
          }
        )
      );
    },
    queryName: function(i) {
      top.Window.Prompt(
        function(a){
          if (a) {
            this.castSpell({spellName:this.knownSpells[i].name,spellId:this.knownSpells[i].item,filter:this.knownSpells[i].filter,requirements:this.knownSpells[i].requirements,target:a});
          }
        },
        this,
        'Для каста заклинания необходимо выбрать цель. Введите ник или щёлкните по нику в чате',
        '',
        'Кастуем "<b>'+this.knownSpells[i].name+'</b>"'
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
      var match;
      for (var i=0; i<doc.images.length; i++) {
        var obj = doc.images[i];
        if (obj.src=='http://img.combats.ru/i/items/'+params.spellId+'.gif') {
          while(obj && obj.tagName!='A')
            obj = obj.nextSibling;
          if (obj && (match = decodeURI(obj.href).match(/^javascript\:(magicklogin\('(.*?)',\s*.*\))$/)) && match[2]==params.spellName) {
            return obj;
          }
        }
      }
      return null;
    },
    matchStats: function(params) {
      if (!params.requirements)
        return true;
      var result = true;
      var doc = combats_plugins_manager.getMainFrame().document;
      var scripts = doc.getElementsByTagName('script');
      for(var i=0; i<scripts.length; i++) {
        var match = scripts[i].innerHTML.match(/DrawBar\('Характеристики', 'stat', (\d+), '', ''\)/);
        if (match && (parseInt(match[1])&1)==1) {
          var obj = scripts[i].nextSibling;
          while(obj.nodeName!='SCRIPT') {
            if (obj.nodeName=='#text') {
              if ((obj.nodeValue in params.requirements) && parseInt(obj.nextSibling.innerText)<params.requirements[obj.nodeValue]) {
                result = false;
                break;
              }
            }
            obj = obj.nextSibling;
          }
        }
      }
      return result;
    },
    doCast: function(link, params) {
      var doc = link.document;
      var match=decodeURI(link.href).match(/^javascript\:(magicklogin\('(.*?)',\s*.*\))$/)
      doc.parentWindow.eval(match[1]);
      doc.forms['slform'].elements['param'].value = params.target;
      doc.forms['slform'].submit();
    },
    castSpell: function(params, step) {
      try {
        if (combats_plugins_manager.getMainFrame().location.pathname=='/exchange.pl') {
          if (!this.exchangeDetected) {
            this.sendAutoResponse('private ['+params.target+'] Я сейчас в передачах. Освобожусь - кастану, ожидайте (автоответ)');
            this.exchangeDetected = true;
            var centerElements = combats_plugins_manager.getMainFrame().document.getElementsByTagName('center');
            if (centerElements.length==0 || centerElements[0].innerText=='Передача предметов/кредитов другому игроку') {
              setTimeout(function(){top.cht('/main.pl');}, 0);
            }
          }
          throw new Exception('');
        }
      } catch(e) {
        setTimeout(combats_plugins_manager.get_binded_method(this,this.castSpell,params,step), 1000);
        return;
      }
      this.exchangeDetected = false;
      if (!step) {
        if (!this.cast_myself && params.target==top.mylogin) {
          return;
        }
        if (!this.inProgress) {
          this.inProgress = true;
          var link;
          if (link=this.findSpell(params)) {
            if (this.matchStats(params)) {
              this.mainframeload_handler = combats_plugins_manager.get_binded_method(this,this.castSpell,params,2);
              combats_plugins_manager.attachEvent('mainframe.load',this.mainframeload_handler);
              this.doCast(link, params);
            } else {
              alert('Наденьте правильный комплект!');
              this.nextCast();
            }
          } else {
            this.mainframeload_handler = combats_plugins_manager.get_binded_method(this,this.castSpell,params,1);
            combats_plugins_manager.attachEvent('mainframe.load',this.mainframeload_handler);
            top.cht('/main.pl?edit=5&filter='+params.filter+'&'+Math.random());
          }
        } else {
          this.castQueue.push(params);
        }
      } else switch (step) {
        case 1:
          combats_plugins_manager.detachEvent('mainframe.load',this.mainframeload_handler);
          var link;
          if (link=this.findSpell(params)) {
            if (this.matchStats(params)) {
              this.mainframeload_handler = combats_plugins_manager.get_binded_method(this,this.castSpell,params,2);
              combats_plugins_manager.attachEvent('mainframe.load',this.mainframeload_handler);
              this.doCast(link, params);
            } else {
              alert('Наденьте правильный комплект!');
              this.nextCast();
            }
          } else {
            this.sendAutoResponse('private ['+params.target+'] По каким-то причинам я не могу сейчас кастовать :chtoza: (автоответ)');
            this.nextCast();
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
            this.sendAutoResponse('private ['+params.target+'] По каким-то причинам результат каста не распознан :chtoza: (автоответ)');
          }
          this.nextCast();
          break;
        }
    },
    nextCast: function() {
      setTimeout(
        combats_plugins_manager.get_binded_method(
          this,
          function() {
            this.inProgress = false;
            if (this.castQueue.length>0)
              this.castSpell(this.castQueue.shift());
          }
        ),
        0
      );
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
            this.selectCast)
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