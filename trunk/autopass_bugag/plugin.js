(function() {
//  if (!(/^(?:emeraldscity|dungeon)\.combats\.(?:com|ru)$/.test(top.location.host)))
//    return null;

  return {
    state: 0,
    glassComplect: '',

    toString: function() {
      return "Проход через Бугага";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","autopass_bugag\\settings.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","autopass_bugag\\settings.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      return [
        { name:"Ссылка на комплект", value: 'http://'+top.location.host+'/main.pl?skmp='+this.glassComplect }
      ];
    },
    setProperties: function(a) {
      var match = a[0].value.match(/(?:\?|&)skmp=(\d+)/);
      if (match)
        this.glassComplect = match[1];
      else
        this.glassComplect = '';
      this.save('glassComplect',this.glassComplect);
    },
    bugagClick: function(e) {
      e = e || top.combats_plugins_manager.getMainFrame().event;
      var d = top.combats_plugins_manager.getMainFrame().document;
      var div = d.body.insertBefore(
        d.createElement(
          '<div style="position:absolute; left:'+Math.max(0,e.clientX-100)+'px; top:'+Math.max(0,e.clientY-10)+'px; text-align:center; color:#003388; background:#e2e0e0; font-weight:bold;">'));
      div.innerHTML = '<div style="margin:0.5em;"><span style="cursor:pointer">Пройти в город</span></div><div style="margin:0.5em;"><span style="cursor:pointer">Поговорить</span></div>';
      div.firstChild.onclick = combats_plugins_manager.get_binded_method(this,this.startBugagPass);
      div.lastChild.onclick = function() {
        top.combats_plugins_manager.getMainFrame().location = '/portal.pl?path=o0&rnd='+Math.random();
      };
    },
    startBugagPass: function() {
      if (this.glassComplect!='') {
        this.state = 2;
        top.combats_plugins_manager.getMainFrame().location = 'http://'+top.location.host+'/main.pl?skmp='+this.glassComplect+'&tmp='+Math.random();
      } else {
        this.state = 1;
        top.combats_plugins_manager.getMainFrame().location = 'http://'+top.location.host+'/main.pl?edit=1&tmp='+Math.random();
      }
    },
    onloadHandler: function() {
      switch (this.state) {
      case 0:
        if (top.combats_plugins_manager.getMainFrame().location.pathname!='/portal.pl')
          return;
        try {
          var d = top.combats_plugins_manager.getMainFrame().document;
          var arr_H4 = d.getElementsByTagName('H4');
          if (arr_H4.length>0) {
            var button = d.createElement('<input type="button" value="Показать параметры" onclick="top.cht(\'/main.pl?attack=[]\')"/>');
            d.body.insertBefore(button,arr_H4[0]);
          }
          var bugag=d.getElementById('mo_dialog:emc_bugag_prewelcome');
          if (!bugag)
            return;
          bugag.onclick = combats_plugins_manager.get_binded_method(this,this.bugagClick);
        } catch (e) {
          combats_plugins_manager.logError(this,e);
        }
        break;
      case 1:
        this.state = 2;
        var images = top.combats_plugins_manager.getMainFrame().document.images;
        var obj = null;
        for(var i=0; i<images.length; i++) {
          if (images[i].src.match(/^(?:http\:\/\/img\.combats\.(?:com|ru)\/i|file\:\/\/.*?)\/items\/glasses(?:1|2)\.gif/)) {
            var obj = images[i];
            while(obj && obj.nodeName!='A') {
              obj = obj.nextSibling;
            }
            break;
          }
        }
        if (obj) {
          obj.click();
          break;
        }
      case 2:
        this.state = 3;
        top.combats_plugins_manager.getMainFrame().location = '/portal.pl?path=o0&rnd='+Math.random();
        break;
      case 3:
        if (top.combats_plugins_manager.getMainFrame().document.getElementsByTagName('H3').length<=0 ||
            top.combats_plugins_manager.getMainFrame().document.getElementsByTagName('H3')[0].innerText!='БУГАГ') {
          this.state = 0;
          break;
        }
        this.state = 4;
        for(var i=0;i<top.combats_plugins_manager.getMainFrame().document.links.length;i++)
          if (top.combats_plugins_manager.getMainFrame().document.links[i].search.match(/\?move_dialog=(?:3|4)/)) {
            top.combats_plugins_manager.getMainFrame().location = top.combats_plugins_manager.getMainFrame().document.links[i].href;
            break;
          }
        break;
      case 4:
        this.state = 5;
        top.combats_plugins_manager.getMainFrame().location = '/main.pl?move_dialog=0&'+Math.random();
        break;
      case 5:
        this.state = 0;
        top.combats_plugins_manager.getMainFrame().location = '/main.pl?move_dialog=0&'+Math.random();
        break;
      }
    },
    Init: function() {
      this.glassComplect = this.load('glassComplect','');
      top.combats_plugins_manager.attachEvent(
        "mainframe.load",
        combats_plugins_manager.get_binded_method(this,this.onloadHandler)
      );
      this.onloadHandler();
      return this;
    }
  }.Init();
})()
