(function() {
  var plugin_autopass_bugag = function() {
    this.glassComplect = this.load('glassComplect','');
    top.combats_plugins_manager.attachEvent(
      "mainframe.load",
      combats_plugins_manager.get_binded_method(this,this.onloadHandler)
    );
    this.onloadHandler();
  };

  plugin_autopass_bugag.prototype = {
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
    bugagClick: function() {
      if (this.glassComplect!='') {
        this.state = 2;
        top.frames[3].location = 'http://'+top.location.host+'/main.pl?skmp='+this.glassComplect+'&tmp='+Math.random();
      } else {
        this.state = 1;
        top.frames[3].location = 'http://'+top.location.host+'/main.pl?edit=1&tmp='+Math.random();
      }
    },
    onloadHandler: function() {
      switch (this.state) {
      case 0:
        if (top.frames[3].location.pathname!='/portal.pl')
          return;
        try {
          var d = top.frames[3].document;
          var bugag=d.getElementById('mo_dialog:emc_bugag_prewelcome');
          if (!bugag)
            return;
          bugag.onclick = combats_plugins_manager.get_binded_method(this,this.bugagClick);
          var arr_H4 = d.getElementsByTagName('H4');
          var button = d.createElement('<input type="button" value="Показать параметры" onclick="top.cht(\'/main.pl?attack=[]\')"/>');
          d.body.insertBefore(button,arr_H4[0]);
        } catch (e) {
          combats_plugins_manager.logError(this,e);
        }
        break;
      case 1:
        this.state = 2;
        var images = top.frames[3].document.images;
        var obj = null;
        for(var i=0; i<images.length; i++) {
          if (images[i].src.match(/http\:\/\/img\.combats\.ru\/i\/items\/glasses(?:1|2)\.gif/)) {
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
        top.frames[3].location = '/portal.pl?path=o0&rnd='+Math.random();
        break;
      case 3:
        if (top.frames[3].document.getElementsByTagName('H3').length<=0 ||
            top.frames[3].document.getElementsByTagName('H3')[0].innerText!='БУГАГ') {
          this.state = 0;
          break;
        }
        this.state = 4;
        for(var i=0;i<top.frames[3].document.links.length;i++)
          if (top.frames[3].document.links[i].search.match(/\?move_dialog=(?:3|4)/)) {
            top.frames[3].location = top.frames[3].document.links[i].href;
            break;
          }
        break;
      case 4:
        this.state = 5;
        top.frames[3].location = '/main.pl?move_dialog=0&'+Math.random();
        break;
      case 5:
        this.state = 0;
        top.frames[3].location = '/main.pl?move_dialog=0&'+Math.random();
        break;
      }
    }
  };
  
  if (top.location.host=='emeraldscity.combats.ru')
    return new plugin_autopass_bugag();
  else
    return null;
})()