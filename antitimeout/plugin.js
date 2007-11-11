function plugin_antitimeout() {
  this.load = function(key,def_val){
    return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),key,def_val);
  };
  this.save = function(key,val){
    external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),key,val);
  }
  this.autotime = parseInt(this.load("autotime","90")); // время в секундах до самостоятельного удара
  this.kickTimer = null;
  this.toString = function() {
    return "Предотвращение тайм-аута (автобой)";
  }
}

plugin_antitimeout.prototype.getProperties = function() {
  return [
    { name:"Время автоудара (сек)", value: this.autotime }
  ];
}

plugin_antitimeout.prototype.setProperties = function(a) {
  this.autotime=a[0].value;
  this.save("autotime",this.autotime); // время в секундах до самостоятельного удара
}

plugin_antitimeout.prototype.clearKickTimer = function() {
  if (antitimeout.kickTimer==null)
    return;
  clearTimeout(antitimeout.kickTimer);
  antitimeout.kickTimer = null;
}

plugin_antitimeout.prototype.autoKick = function() {
  elements = top.frames[3].document.forms["f1"].elements;
  var block = Math.floor(Math.random()*5);
  var is_block=true;
  var point=-1;
  if ("let_attack" in elements) {
    for (i=5; i>=0; i--) {
      if (is_block) {
        s = "r_"+i+"_"+block;
        if (s in elements)
          is_block = false;
      } else {
        do {
          new_point=(block+Math.floor(Math.random()*3))%5;
        } while (new_point==point);
        point=new_point;
        s = "r_"+i+"_"+point;
      }
      if (s in elements) {
        elements[s].click();
      }
    }
    elements["let_attack"].click();
  } else
    top.frames[3].location = top.frames[3].location.href;
}

plugin_antitimeout.prototype.onloadHandler = function() {
  if (top.frames[3].location.href.search(/^http\:\/\/\w+\.combats\.ru\/battle\d*\.pl/)!=0)
    return;

  if (antitimeout.kickTimer!=null) 
    clearTimeout(antitimeout.kickTimer);
  if (antitimeout.autotime>0)
    antitimeout.kickTimer = setTimeout( antitimeout.autoKick, antitimeout.autotime*1000 );
  else
    antitimeout.kickTimer = null;
  top.frames[3].attachEvent( "onbeforeunload", antitimeout.clearKickTimer);
  d = top.frames[3].document;
  if (("f1" in d.forms) && ("let_attack" in d.forms["f1"].elements)) {
    button = d.createElement("<input type=button value='Случайный Удар'>");
    attack_button = d.forms["f1"].elements["let_attack"];
    attack_button.parentNode.insertBefore(button,attack_button);
    button.attachEvent("onclick", antitimeout.autoKick);
  }
}

antitimeout = new plugin_antitimeout();
top.frames[3].frameElement.attachEvent("onload",function(){antitimeout.onloadHandler();});
antitimeout