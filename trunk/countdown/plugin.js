(function() {
  return {
    timer: null,
    toString: function() {
      return "ќбратный отсчЄт";
    },
    onloadHandler: function(eventObj) {
// $('div > img[onmouseover]',combats_plugins_manager.getMainFrame().document).map(function(){return this.onmouseover.toString().replace(/^[\s\S\n\r]*?{[\s\n\r]*|[\s\n\r]*}[\s\S\n\r]*?$/g,'');})
      try {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        if (!eventObj.window.location.pathname.match(/^\/zayavka\.pl/)) {
          return;
        }
        this.$claims = $('input:radio[name=gocombat]',eventObj.window.document);
        this.$waitingBattle = $('form[name=F1]',eventObj.window.document).find('table>tbody>tr>td:has(b)');
        if (this.$claims.length<=0 && (this.$waitingBattle.length<=0 || this.$waitingBattle.find('b').text().indexOf('ќжидаем')!=0)) {
          return;
        }
        this.timer = setTimeout(top.combats_plugins_manager.get_binded_method(this,this.timerHandler), 6000);
      } catch(e) {
        top.combats_plugins_manager.add_chat(e.message);
      }
    },
    timerHandler: function() {
      if (this.$claims.length<=0 && this.$waitingBattle.length<=0) {
        return;
      }
      var stop = true;
      this.$claims.each(function(){
        var $counter = $(this).nextAll('.dsc:first').find('b');
        var timeRest = parseFloat($counter.html());
        if (timeRest) {
          timeRest -= 0.1;
          $counter.html((timeRest<1?'0':'')+(''+Math.round(timeRest*10)).replace(/(\d)$/,'.$1'));
          stop = false;
        }
      });
      if (this.$waitingBattle.length>0 && this.$waitingBattle.find('b').text().indexOf('ќжидаем')==0) {
        this.$waitingBattle.html(this.$waitingBattle.html().replace(/-?[\d\.]+/, function(a){
          var timeRest=parseFloat(a)-0.1;
          stop = false;
          return (timeRest<1?'0':'')+(''+Math.round(timeRest*10)).replace(/(\d)$/,'.$1');
        }));
      }
      if (!stop) {
        this.timer = setTimeout(top.combats_plugins_manager.get_binded_method(this,this.timerHandler), 6000);
      } else {
        this.timer = null;
      }
    },
    Init: function() {
      top.combats_plugins_manager.attachEvent(
        'mainframe.load',
        top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.Init();
})()