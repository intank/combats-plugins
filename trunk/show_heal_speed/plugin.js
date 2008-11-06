(function(){
  var old_setHPlocal = top.setHPlocal;
  top.setHPlocal = function(){
    old_setHPlocal.apply(top,[]);
    var HP=top.combats_plugins_manager.getMainFrame().document.all("HP");
    if (HP) {
      var maxT=1800/top.speed*100;
      var T=Math.floor(maxT/top.maxHP*100);
      if (tkHP<maxHP)
        HP.innerHTML = HP.innerHTML+'(100HP/'+T+'сек.)';
    }
  }
  var old_setManalocal = top.setManalocal;
  top.setManalocal = function(){
    old_setManalocal.apply(top,[]);
    var Mana=top.combats_plugins_manager.getMainFrame().document.all("Mana");
    if (Mana) {
      var maxT=1800/top.speed*100;
      var T=Math.floor(maxT/top.maxMana*100);
      if (tkMana<maxMana)
        Mana.innerHTML = Mana.innerHTML+'(100HP/'+T+'сек.)';
    }
  }
})()