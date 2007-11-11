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
    this.toString: function() {
      return "Ѕыстрые заклинани€";
    },
    getProperties: function() {
      return [];
    },
    plugin_fast_cast.prototype.setProperties = function(a) {
    },
    castSpell: function(params, step) {
      if (!step) {
        if (!this.inProgress) {
          this.inProgress = true;
          this.mainframeload_handler = combats_plugins_manager.get_binded_method(this,this.castSpell,params,1);
          combats_plugins_manager.attachEvent('mainframe.load',this.mainframeload_handler);
          combats_plugins_manager.getMainFrame().location = '/main.pl?edit=2&'+Math.random();
        } else {
          this.castQueue.push(params);
        }
      } else switch (step) {
        case 1:
//          debugger;
          combats_plugins_manager.detachEvent('mainframe.load',this.mainframeload_handler);
          var doc = combats_plugins_manager.getMainFrame().document;
          var result = false;
          for (var i=0; i<doc.images.length; i++) {
            if (doc.images[i].src=='http://img.combats.ru/i/items/'+params.spellId+'.gif') {
              var obj = doc.images[i];
              while(obj && obj.tagName!='A')
                obj = obj.nextSibling;
              if (obj && (match=obj.href.match(/^javascript\:(magicklogin\('(.*?)', .*\))$/)) && match[2]==params.spellName) {
                doc.parentWindow.eval(match[1]);
                doc.forms['slform'].elements['param'].value = params.target;

                this.mainframeload_handler = combats_plugins_manager.get_binded_method(this,this.castSpell,params,2);
                combats_plugins_manager.attachEvent('mainframe.load',this.mainframeload_handler);
                
                doc.forms['slform'].submit();
                result = true;
                break;
              }
            }
          }
          if (!result) {
            this.sendAutoResponse('private ['+this.Healing.partner+'] ѕо каким-то причинам € не могу сейчас кастовать :chtoza: (автоответ)');
          }
          break;
        case 2:
          combats_plugins_manager.detachEvent('mainframe.load',this.mainframeload_handler);
          var doc = combats_plugins_manager.getMainFrame().document;
          var castResult = doc.getElementsByTagName('TABLE')[0].cells[1].firstChild;
          if (castResult.nodeName=='FONT' && castResult.currentStyle.color=='red') {
            this.sendAutoResponse('private ['+this.Healing.partner+','+this.Healing.patient+'] '+castResult.innerText+' (автоответ)');
          } else {
            this.sendAutoResponse('private ['+this.Healing.partner+'] ѕо каким-то причинам результат каста нераспознан :chtoza: (автоответ)');
          }
          this.inProgress = false;
          if (this.castQueue.length>0)
            castSpell(this.castQueue.shift());
          break;
        }
    },
    init: function() {
    }
  };

  return new plugin_fast_cast();
})()