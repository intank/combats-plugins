(function() {
  if (top.location.hostname!='mooncity.combats.com') {
//    throw new Error('Плагин "mana_donor" работает только в <B>mooncity</B>');
    combats_plugins_manager.add_chat('<font class="date2">'+(new Date()).toLocaleTimeString()+'</font> Плагин "mana_donor" работает только в <B>mooncity</B>');
    return null;
  }
  return {
    active: false,
    hide: false,
    timeOut: 1,
    timer: null,
    donate_mana: 500, // 100, 500, 1000

    toString: function() {
      return "Донор маны";
    },
    
    getProperties: function() {
      return [
        { name:"Активен", value: this.active },
        { name:"Прятаться на входах", value: this.hide },
        { name:"Количество сдаваемой маны",
          value: {
            'length': 3,
            0: '100', 
            1: '500', 
            2: '1000', 
            'selected': (this.donate_mana==100)?0:((this.donate_mana==500)?1:2)
          } 
        }
      ];
    },

    setProperties: function(a) {
      if (this['debugger']) { debugger; }
      this.active = a[0].value;
      this.hide = a[1].value;
      this.donate_mana = parseFloat(a[2].value[a[2].value.selected]);
    },

    manaReady: function() {
      if (!this.active)
        return;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout( // защита от лагов
        combats_plugins_manager.get_binded_method(this,this.manaReady),
        5000
      );
      if (combats_plugins_manager.getMainFrame().location.pathname=='/dungeon.pl') {
        top.cht('/dungeon.pl?path=1.107.4&rnd='+Math.random());
      } else {
        var d = combats_plugins_manager.getMainFrame().document;
        if (d.body.innerHTML.search('http://img.combats.ru/i/images/300x225/mn_bg_portal.jpg')<0)
          return;
        top.cht('/main.pl?path=donate_mana&num='+this.donate_mana+'&rnd='+Math.random());
      }
    },

    onloadHandler: function() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!this.active)
        return;
      try {
        var d = combats_plugins_manager.getMainFrame().document;
        if (d.body.innerHTML.search('http://img.combats.ru/i/images/300x225/mn_bg_portal.jpg')<0)
          return;
        var match = this.match = d.body.innerHTML.match(/top\.setMana\((.*?),(.*?),(.*?)\)/);
        if (match) { // top.setMana(546.6,840,300)
          this.speed = parseFloat(match[2])/3000*parseFloat(match[3]);
          this.timeOut = Math.max(0,10+(this.donate_mana-parseFloat(match[1]))/speed*60);

          this.timer = setTimeout(
            combats_plugins_manager.get_binded_method(this,this.manaReady),
            this.timeOut*1000
          );
          if (this.hide && this.timeOut>10) {
            this.selectDungeon(d);
          }
        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    },
    
    selectDungeon: function(d) {
      var ione = d.getElementById('ione');
      if (!ione)
        return;
      
      var gungeons = [];
      var i;
      for(i=0; i<ione.childNodes.length; i++) {
        if (ione.childNodes[i].tagName=='DIV') {
          var firstChild = ione.childNodes[i].firstChild;
          if (firstChild.tagName=='IMG' && firstChild.src.match(/\.gif$/)) // проверку на портал сделать
            gungeons.push(firstChild);
        }
      }
      if (gungeons.length>0) {
        gungeons[Math.floor(Math.random()*gungeons.length)].click();
      }
    },

    Init: function() {
      top.combats_plugins_manager.attachEvent(
        "mainframe.load",
        combats_plugins_manager.get_binded_method(this,this.onloadHandler)
      );
    }
  }.Init();
})()