(function(){
  var old_setHPlocal = top.setHPlocal;
  var timer;
  top.setHPlocal = function() {
    clearTimeout(timer);
    if (top.frames[3].document.getElementById("HP1")==null || top.frames[3].document.getElementById("HP2")==null) {
      timer = setTimeout(function(){top.setHPlocal();}, 100);
    } else
      old_setHPlocal();
  }
})()