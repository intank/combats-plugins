(function(){
  var old_setHPlocal = top.setHPlocal;
  var timer;
  top.setHPlocal = function() {
    clearTimeout(timer);
    var frame = top.combats_plugins_manager.getMainFrame();
    if (frame.document.getElementById("HP1")==null || frame.document.getElementById("HP2")==null) {
      timer = setTimeout(function(){top.setHPlocal();}, 100);
    } else
      old_setHPlocal();
  }
})()