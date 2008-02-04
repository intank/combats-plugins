(function() {
	plugin_antitimeout = function() {
		this.autotime = 0;
		this.kickTimer = null;
		this.init();
		this.onloadHandler();
	}

	plugin_antitimeout.prototype.toString = function() {
		return "Предотвращение тайм-аута (автобой)"; 
	}

	plugin_antitimeout.prototype.getProperties = function() {
		return [{ name:"Время автоудара (сек)", value: this.autotime }];
	}
	
	plugin_antitimeout.prototype.setProperties = function(a) {
		this.autotime=a[0].value;
		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"autotime",this.autotime);
	}
	
	plugin_antitimeout.prototype.clearKickTimer = function() {
		if (this.kickTimer==null)
			return;
		clearTimeout(this.kickTimer);
		this.kickTimer = null;
	}
	
	plugin_antitimeout.prototype.setKickTimer = function(kick_time) {
		if (this.kickTimer!=null)
			clearTimeout(this.kickTimer);
		this.kickTimer = setTimeout( top.combats_plugins_manager.get_binded_method(this,this.autoKick), kick_time);
	}

	plugin_antitimeout.prototype.autoKick = function() {
		try {
			if( (typeof(top.Battle.oBattle )!="object") && !top.Battle.bInBattle) 
				return;
			if(top.Battle.oBattle.bGameOver){ //---------------- Гейм оувер
				top.Battle.End(top.Battle.oBattle.sLocation);
				return;
			}
			if( top.Battle.oBattle.nRequests ) { //------------------- Если занято, обновляем и ждем 5 сек
				top.Chat.am('Busy! '+top.Battle.oBattle.nRequests); 
				top.Battle.oBattle.Refresh();
				top.Battle.oBattle.nRequests=0;
				this.setKickTimer(3*1000);
			}

			top.Battle.oBattle.Attack(); //------------ Наносим удар
			this.setKickTimer(this.autotime*1000);
			//top.Battle.oBattle.Attack();
		}catch(e){
			e.Function = 'autoKick';
        	combats_plugins_manager.logError(this,e);
		}
	}
	
	plugin_antitimeout.prototype.onloadHandler = function() {
		try {
			if (top.frames[3].location.href.search(/^http\:\/\/\w+\.combats\.ru\/battle\d*\.pl/)!=0)
				return;
			if (this.autotime>0)
				this.setKickTimer(this.autotime*1000);
			else
				this.kickTimer = null;
			top.frames[3].attachEvent( "onbeforeunload", top.combats_plugins_manager.get_binded_method(this,this.clearKickTimer));
			//  d = top.Battle.oBattle.oLayer.ownerDocument;
  
		}catch(e){
			e.Function = 'onLoadHandler';
        	combats_plugins_manager.logError(this,e);
		}
	}
	
	plugin_antitimeout.prototype.init = function() {
		var t = external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"autotime","90");
		this.autotime = parseInt(t); // время в секундах до самостоятельного удара

		top.combats_plugins_manager.attachEvent('mainframe.load',top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
	}
	
	return new plugin_antitimeout();
})()
