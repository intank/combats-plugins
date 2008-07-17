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
})()