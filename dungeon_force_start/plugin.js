(function(){
  return {
    active: false,
    timer: null,
    period: 3,
    toString: function() {
      return "Автоматический вход в пещеру";
    },
    getProperties: function() {
      return [
        { name:"Период нажатия", value: this.period }
      ];
    },
    setProperties: function(a) {
      this.period = Math.max(parseFloat(a[0].value), 0.5);
      this.config.saveIni('period',this.period.toString());
    },
    isStartDungeon: function() {
      var loc = top.combats_plugins_manager.getMainFrame().location;
      if (loc.pathname!='/dungeon.pl')
        return false;
      if (!loc.search.match(/[\?&]start=/))
        return false;
      return true;
    },
    onloadHandler: function() {
      try {
        if (!this.isStartDungeon())
          return;
        if (this.timer)
          clearTimeout(this.timer);
        this.timer = setTimeout(combats_plugins_manager.get_binded_method(this,this.tryStart), this.period*1000);
      } catch(e) {
      }
    },
    tryStart: function() {
      clearTimeout(this.timer);
      this.timer = null;
      if (!this.isStartDungeon())
        return;
      top.combats_plugins_manager.getMainFrame().location = '/dungeon.pl?start=Начать&'+Math.random();
    },
    Init: function() {
      this.config = combats_plugins_manager.createConfigurationElement('dungeon_force_start');
      this.period = Math.max(parseFloat(this.config.loadIni('period','3')), 0.5);
      top.combats_plugins_manager.attachEvent(
        'mainframe.load',
        top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.Init();
})()