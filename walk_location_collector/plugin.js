(function(){
  return {
    locations: {},
    getProperties: function() {
      var locations = [];
      for(var location in this.locations) {
        locations.push(location);
      }
      return [
        { name:"ѕеречень известных локаций", value:locations.join('\n'), type:'textarea' }
      ];
    },
    toString: function() {
      return "—борщик названий локаций";
    },
    mainframeLoad: function(eventObj) {
      if (!eventObj.window.location.pathname.match(/\/dungeon\d*\.pl/) 
          || !eventObj.window.document.getElementById('DungMap'))
        return;
      var location = top.combats_plugins_manager.getMainFrame().document.getElementsByTagName('table')[0].cells[1].innerHTML;
      location = location.replace(/<.*/,'');
      this.locations[location] = true;
    },
    Init: function() {
      combats_plugins_manager.attachEvent(
        'mainframe.load',
        combats_plugins_manager.get_binded_method(this,this.mainframeLoad));
      return this;
    }
  }.Init();
})()