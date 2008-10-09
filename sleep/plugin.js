(function (){
  var plugin_sleep = function() {
    top.combats_plugins_manager.attachEvent(
      "mainframe.load",
      combats_plugins_manager.get_binded_method(this,this.onloadHandler));
  };

  plugin_sleep.prototype = {
    goingToRoom: false,
    timerId: null,
    req: null,
    waitForWeakeningGone: false,
    toString: function() {
      return "Усыпальница :)";
    },
    getProperties: function() {
      return [{name:'Дождаться завершения ослабления', value:this.waitForWeakeningGone}];
    },
    setProperties: function(a) {
      this.waitForWeakeningGone = a[0].value;
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
        }
        if (!this.req)
          this.req = top.combats_plugins_manager.getHTTPRequest();
        this.req.open('GET', '/main.pl?edit=5&'+Math.random(), false);
        this.req.send('');
        s = this.req.responseText;
        var match = s.match(/<B><U>Ослабление после боя<\/U><\/B>\s*\(Эффект\)<BR>Осталось\:\s*(\d+)\s*мин\.<BR>/);
        if (match) {
          this.timerId = setTimeout(
            top.combats_plugins_manager.get_binded_method(this, this.sleep), 
            60*parseFloat(match[1])*1000
          );
          return;
        }
      }
      d.location = d.location.protocol+'//'+d.location.hostname+'/house.pl?to_sleep=1&sd4=&room=4&'+Math.random();
    },
    onloadHandler: function() {
      if (top.combats_plugins_manager.getMainFrame().location.pathname!='/house.pl')
        return;
      var d = top.combats_plugins_manager.getMainFrame().document;
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
    }
  };
  return new plugin_sleep();
})()