(function (){
  return {
    goingToRoom: false,
    timerId: null,
    hurryTime: 30,
    req: null,
    waitForWeakeningGone: false,
    toString: function() {
      return "Усыпальница :)";
    },
    getProperties: function() {
      return [
        {name:'Дождаться завершения ослабления', value:this.waitForWeakeningGone},
        {name:'Минимально допустимое время ослабления (с)', value:this.hurryTime}
      ];
    },
    setProperties: function(a) {
      this.waitForWeakeningGone = a[0].value;
      this.hurryTime = Math.max(0,parseFloat(a[1].value)||0);

      this.configurator.saveIni('waitForWeakeningGone',this.waitForWeakeningGone.toString());
      this.configurator.saveIni('hurryTime',this.hurryTime.toString());
    },
    goToRoom: function(onclick) {
      this.goingToRoom = true;
      return onclick?onclick.apply(frames[3],[]):true;
    },
    sleep: function() {
      var d = top.combats_plugins_manager.getMainFrame().document;
      if (this.waitForWeakeningGone) {
        if (this.timerId) {
          clearTimeout(this.timerId);
          this.timerId = null;
        }
        if (!this.req)
          this.req = top.combats_plugins_manager.getHTTPRequest();
        this.req.open('GET', '/main.pl?edit=5&'+Math.random(), false);
        this.req.send('');
        s = this.req.responseText;
        var match = s.match(/<B><U>Ослабление после боя<\/U><\/B>\s*\(Эффект\)<BR>Осталось\:(?:\s*(\d+)\s*мин\.|)(?:\s*(\d+)\s*сек\.|)\s*<BR>/i);
        if (match && (time=(60*(parseFloat(match[1])||0)+(parseFloat(match[2])||0)))>this.hurryTime) {
          this.timerId = setTimeout(
            top.combats_plugins_manager.get_binded_method(this, this.sleep), 
            (time-this.hurryTime)*1000);
          return;
        }
      }
      d.location = d.location.protocol+'//'+d.location.hostname+'/house.pl?to_sleep=1&sd4=&room=4&'+Math.random();
    },
    onloadHandler: function(eventObj) {
      if (eventObj.window.location.pathname!='/house.pl')
        return;
      var d = eventObj.window.document;
      if (this.goingToRoom) {
        this.goingToRoom = false;
        var canSleep = true;
        var fonts = d.getElementsByTagName('FONT');
        for(var i=0; i<fonts.length; i++) {
          if (fonts[i].innerText=='Вы ничего не арендуете на этом этаже') {
            canSleep = false;
            break;
          }
        }
        if (canSleep) {
          this.sleep();
          return;
        }
      } else
        this.goingToRoom = false;
      var moveto = d.getElementById('moveto');
      var directions = moveto.getElementsByTagName('a');
      for (var i=0; i<directions.length; i++)
        if (directions[i].search.search(/[\?&]path=1\.200.[125](?:$|&)/)>=0) {
          directions[i].onclick = combats_plugins_manager.get_binded_method(
            this,
            this.goToRoom,
            directions[i].onclick
          );
        }
    },
    Init: function() {
      this.configurator = combats_plugins_manager.createConfigurationElement('sleep');
      this.waitForWeakeningGone = this.configurator.loadIni('waitForWeakeningGone', 'false')=='true';
      this.hurryTime = Math.max(0,parseFloat(this.configurator.loadIni('hurryTime', '0'))||0);
      
      top.combats_plugins_manager.attachEvent(
        "mainframe.load",
        combats_plugins_manager.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.Init();
})()