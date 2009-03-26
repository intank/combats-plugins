(function() {
	return {
	  autotime: 0,
	  kickTimer: null,
	  minTime: 5,
	  timeAttack: 0,
	  MethodPriority: [],
	  BusyCount: 0,

	  toString: function() {
		return "Предотвращение тайм-аута (автобой)"; 
	  },

	  getProperties: function() {
	  	var Methods = [];
		for(i=1;i<=20;i++){ // считывание приемов
			var t=external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"Method"+i,"");
			if (t) {
				Methods.push(t);
			}
		}

		return [
			{ name:"Активен", value: this.active },
			{ name:"Время автоудара (сек)", value: this.autotime },
			{ name:"Время обновления (сек)", value: this.minTime },
			{ name:"Время перезагрузки при зависании (сек)", value: this.totalRefreshTime },
			{ name:"Правила", value:Methods.join('\n'), type: 'textarea' }
		];
	  },
	
	  setProperties: function(a) {
		this.active=a[0].value;
		this.autotime=parseFloat(a[1].value);
		this.minTime=parseFloat(a[2].value);
		this.totalRefreshTime=parseFloat(a[3].value);

		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"autotime",""+this.autotime);
		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"refresh",""+this.minTime);
		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"totalRefreshTime",""+this.totalRefreshTime);

		var Methods = a[4].value.split(/[\n\r]+/);
		for(var i=0;i<20;i++) {
			if (!Methods[i])
				Methods[i] = '';
			external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"Method"+(i+1),Methods[i]);
		}
		this.LoadMethods();
		this.checkActive();
	  },
	  
	  checkActive: function() {
		if (this.active) {
			this.onloadHandler();
		}
	  },
	
	  clearKickTimer: function() {
		if (this.kickTimer==null)
			return;
		clearTimeout(this.kickTimer);
		this.kickTimer = null;
	  },
	
	  setKickTimer: function(kick_time) {
		if (this.kickTimer!=null)
			clearTimeout(this.kickTimer);
		this.kickTimer = setTimeout( top.combats_plugins_manager.get_binded_method(this,this.autoKick), kick_time);
	  },

	  addChat: function(msg) {
	  	combats_plugins_manager.add_sys(msg);
	  },

	  Fix: function(){
	    try {
	      var sURL = top.Battle.oQuery.sURL;
	      top.Battle.SetScript(sURL);
	      top.Battle.nRequests = 0;
	      top.Battle.oBattle.Send( null, true );
	    } catch(e) {
	      this.addChat('Ошибка инициализации поединка');
	    }
	  },

	  autoKick: function() {
	  	if (!this.active)
	  		return;
		try {
			if( (typeof(top.Battle.oBattle )!="object") && !top.Battle.bInBattle) //------- А есть ли бой???
				return;
			oBattle=top.Battle.oBattle;
			this.timeAttack+=this.minTime;

			//this.addChat('Checking..................'+this.timeAttack);
			if(top.Battle.oBattle.bGameOver){ //---------------- Гейм оувер
				this.addChat('Game over');
				top.Battle.End(top.Battle.oBattle.sLocation);
				return;
			}
			if( top.Battle.oBattle.nRequests ) { //------------------- Если занято, обновляем и ждем minTime сек
				this.BusyCount+=this.minTime;
				//this.addChat('Busy '+this.BusyCount+'sec.');
				this.Fix(); //Reload (??)
				if(this.totalRefreshTime && this.BusyCount>this.totalRefreshTime){
					//this.addChat('Reloading all');
					top.location=top.location;
					this.BusyCount=0;
				}
				this.setKickTimer(this.minTime*1000);
				return;
			}
			this.BusyCount=0;
			
			//------ Приемы
			for(i=0;i<this.MethodPriority.length;i++){
				id=this.MethodPriority[i].id;
				Res=this.MethodPriority[i].Res;
				//this.addChat(i+'-'+id);
				CheckRes=true;
				for(j in Res){
					if(j=='enemy'){                                //-------------Обработка врага
						CheckEnemy=false;
						//this.addChat(j+'-'+Res[j]);
						en=Res[j].split(/\s*\|\s*/);
						//this.addChat(en);
						for(k in en){
							//this.addChat(k+'-'+en[k]);
							en_a=en[k].match(/([А-я ]*)(\[\s*(\d+)\s*\])?/);
							enName=en_a[1].replace(/(.*?)\s+/, "$1");
							enLevel=en_a[3] ? en_a[3] : 0;
							//this.addChat("Name '"+enName+"', Level '"+enLevel+"', ");
							
							if(enName && enLevel)
								CheckEnemy=(oBattle.arrUsers[oBattle.sEnemy].sName.indexOf(enName)>=0 && oBattle.arrUsers[oBattle.sEnemy].nLevel==enLevel) ? true:CheckEnemy;
							else if(enName)
								CheckEnemy=(oBattle.arrUsers[oBattle.sEnemy].sName.indexOf(enName)>=0) ? true:CheckEnemy;
							else
								CheckEnemy=(oBattle.arrUsers[oBattle.sEnemy].nLevel==enLevel) ? true:CheckEnemy;

							//this.addChat("name+level find :"+CheckEnemy);
						}
						CheckRes=CheckEnemy ? CheckRes:false;
					}else if(j=='my_effect'){                             //-----------------------обработка своих эффектов
						//this.addChat(Res[j]);
						CheckEffect=false;
						if(Res[j].indexOf('-')>=0)
							CheckEffect=true;
						myEff=Res[j].split(/\s*\|\s*/);
						for(k in oBattle.arrUsers){
							if(oBattle.arrUsers[k].sName==oBattle.sMyLogin){
								me=oBattle.arrUsers[k];
								break;
							}
						}
						
						for(k in me.arrEffects){
							CheckEffect=(Res[j].indexOf(me.arrEffects[k].sID)>=0) ? true:CheckEffect;
							CheckEffect=(Res[j].indexOf('-'+me.arrEffects[k].sID)>=0) ? false:CheckEffect;
							//this.addChat(k+'-'+me.arrEffects[k].sID+'-'+CheckEffect);
						}
						CheckRes=CheckEffect ? CheckRes:false;
					}else if(j=='my_hp'){              //-----------------------обработка своего уровня HP
						var Less=(Res[j].indexOf('<')>=0);
						var More=(Res[j].indexOf('>')>=0);
						var Mode_percent=(Res[j].indexOf('%')>=0);
						var lvl = parseFloat(Res[j].replace(/^.*?(\d+).*?$/,'$1'));
						if (!isNaN(lvl)) {
							me=null;
							for(k in oBattle.arrUsers) {
								if(oBattle.arrUsers[k].sName==oBattle.sMyLogin){
									me=oBattle.arrUsers[k];
									break;
								}
							}
							CheckRes = CheckRes && (
								!Mode_percent && (Less && me.nHP<=lvl || More && me.nHP>=lvl)
								||
								Mode_percent && (Less && me.nHP/me.nMaxHP*100<=lvl || More && me.nHP/me.nMaxHP*100>=lvl)
							);
						}
					}else if(j=='enemy_cnt'){              //-----------------------обработка своего уровня HP
						var Less=(Res[j].indexOf('<')>=0);
						var More=(Res[j].indexOf('>')>=0);
						var cnt = parseFloat(Res[j].replace(/^.*?(\d+).*?$/,'$1'));
						if (!isNaN(cnt)) {
							var groups = {};
							var myGroup = '';
							var warriors = oBattle.oGroupsLayer.innerHTML.match(/<SPAN\s+class=['"]?UserBattleGroup(\d+)['"]?[^>]*?>(.*?)<\/SPAN>/g);
							for(var k=0; k<warriors.length; k++) {
								warriors[k] = warriors[k].match(/<SPAN\s+class=['"]?UserBattleGroup(\d+)['"]?[^>]*?>(.*?)<\/SPAN>/);
								if (warriors[k]) {
									groups[warriors[k][1]] = (groups[warriors[k][1]] || 0) + 1;
									if (warriors[k][2]==oBattle.sMyLogin) {
										myGroup = warriors[k][1];
									}
								}
							}
							var enemies = 0;
							for(var k in groups) {
								enemies += (k==myGroup)?0:groups[k];
							}
							CheckRes = CheckRes && (Less && enemies<cnt || More && enemies>cnt);
						}
					}else{                             //-----------------------обработка тактик для приема
						currRes=parseInt(oBattle.arrRes[j].innerHTML);
						//this.addChat(j+'-'+Res[j]+'?'+currRes);
						CheckRes=( (currRes>=parseInt(Res[j])) ? CheckRes : false);
					}
				}
				
				if(CheckRes && typeof(top.Battle.oBattle.arrMethods[id])=='object' && top.Battle.oBattle.arrMethods[id].oMethod.bEnable){
					this.addChat('<b>'+oBattle.arrMethods[id].oMethod.sText+'</b>');
					oBattle.ApplyMethod(top.Battle.oBattle.arrMethods[id].oMethod);
					this.setKickTimer(this.minTime*1000);
					return;
				}
				
			}
			
			//this.addChat("T="+this.timeAttack);
			if(this.timeAttack>=this.autotime){ //------------ Наносим удар если пора
				this.addChat('<b>Attack</b>');
				oBattle.Attack();
				this.timeAttack=0;
			}
//			if(this.autotime)
				this.setKickTimer(this.minTime*1000);
			//top.Battle.oBattle.Attack();
		}catch(e){
			e.Function = 'autoKick';
        	combats_plugins_manager.logError(this,e);
		}
	  },
	
	  onloadHandler: function() {
		if (!this.active)
			return;
		try {
			if (top.frames[3].location.href.search(/^http\:\/\/\w+\.combats\.(?:com|ru)\/battle\d*\.pl/)!=0)
				return;
			if(typeof(top.Battle.oBattle.Class)=='object'){
				if(!(top.Battle.oBattle.Class.Settings() & 1)) top.Battle.oBattle.Class.Settings(1); // ----------Упрощенный бой
				if(!(top.Battle.oBattle.Class.Settings() & 8)) top.Battle.oBattle.Class.Settings(8); // ---------Не сбрасывать выбор
			}			
			//this.addChat('reload');
			if (this.autotime>0)
				this.setKickTimer(this.minTime*1000);
			else
				this.kickTimer = null;
			
			top.frames[3].attachEvent( "onbeforeunload", top.combats_plugins_manager.get_binded_method(this,this.clearKickTimer));
		}catch(e){
			e.Function = 'onLoadHandler';
        	combats_plugins_manager.logError(this,e);
		}
	  },

	  LoadMethods: function() {
	  	this.MethodPriority = [];
		for(i=1;i<=20;i++){ // считывание приемов
			t=external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"Method"+i,"");
			if(a=t.match(/(\S+)\s*([^;]*).*/)){ // ----- отделяем прием от параметров
				var Method=new Object();
				Method['id']= a[1];
				if(a[2]){
					b=a[2].split(/\s*,\s*/); // ---------- разделяем параметры
					Method['Res']={};
					for(j in b){
						c=b[j].split(/\s*:\s*/); // ----------- отделяем название параметра от величины
						Method['Res'][c[0]]=c[1];
					}
				}
				if(Method['id'])
					this.MethodPriority.push(Method);
			}
		}
	  },

	  init: function() {
		
		this.active = false; //----------- плагин активен
		var t = external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"autotime","90");
		this.autotime = parseFloat(t); //----------- время в секундах до самостоятельного удара
		var t = external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"refresh","10");
		this.minTime = parseFloat(t); // --------- минимальное время в секундах для обновления
		var t = external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"totalRefreshTime","45");
		this.totalRefreshTime = parseFloat(t) || 0; // --------- время в секундах для полного обновления окна при зависании

		this.LoadMethods();

		top.combats_plugins_manager.attachEvent('mainframe.load',top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
		this.onloadHandler();
		return this;
	  }
	}.init();
})()
