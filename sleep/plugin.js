(function (){
  var plugin_sleep = function() {
    top.combats_plugins_manager.attachEvent(
      "mainframe.load",
      combats_plugins_manager.get_binded_method(this,this.onloadHandler));
  };

  plugin_sleep.prototype = {
    goingToRoom: false,
    toString: function() {
      return "Усыпальница :)";
    },
    goToRoom: function(onclick) {
      this.goingToRoom = true;
      return onclick?onclick.apply(frames[3],[]):true;
    },
    onloadHandler: function() {
      if (frames[3].location.pathname!='/house.pl')
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
          top.frames[3].location = d.location.protocol+'//'+d.location.hostname+'/house.pl?to_sleep=1&sd4=&room=4&'+Math.random();
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