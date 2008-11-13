(function() {
  return {
    toString: function() {
      return "Фикс бага БК в списке игроков в IE8";
    },
    Init: function() {
      if (navigator.userAgent.indexOf('Trident/4.0;')>=0) {
	top.frames['activeusers'].eval(
	  external.readFile(
	    combats_plugins_manager.security_id,
	    "Combats.RU",
	    "chat_fix_ie8\\activeusers.js"
	  )
	);
	return this;
      } else
	return null;
    }
  }.Init();
})()