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
		return [
			{ name:"Время автоудара (сек)", value: this.autotime },
			{ name:"Время обновления (сек)", value: this.minTime }
		];
	  },
	
	  setProperties: function(a) {
		this.autotime=parseInt(a[0].value);
		this.minTime=parseInt(a[1].value);
		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"autotime",""+this.autotime);
		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"refresh",""+this.minTime);
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

	  autoKick: function() {
		try {
			if( (typeof(top.Battle.oBattle )!="object") && !top.Battle.bInBattle) //------- А есть ли бой???
				return;
			oBattle=top.Battle.oBattle;
			this.timeAttack+=this.minTime;

			//top.Chat.am('Checking..................'+this.timeAttack);
			if(top.Battle.oBattle.bGameOver){ //---------------- Гейм оувер
				top.Chat.am('Game over');
				top.Battle.End(top.Battle.oBattle.sLocation);
				return;
			}
			if( top.Battle.oBattle.nRequests ) { //------------------- Если занято, обновляем и ждем minTime сек
				this.BusyCount+=this.minTime;
				//top.Chat.am('Busy '+this.BusyCount+'sec.');
				top.Battle.oBattle.Send( null, true ); //Reload (??)
				if(this.BusyCount>40){
					//top.Chat.am('Reloading all');
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
				//top.Chat.am(i+'-'+id);
				CheckRes=true;
				for(j in Res){
					if(j=='enemy'){                                //-------------Обработка врага
						CheckEnemy=false;
						//top.Chat.am(j+'-'+Res[j]);
						en=Res[j].split(/\s*\|\s*/);
						//top.Chat.am(en);
						for(k in en){
							//top.Chat.am(k+'-'+en[k]);
							en_a=en[k].match(/([А-я ]*)(\[\s*(\d+)\s*\])?/);
							enName=en_a[1].replace(/(.*?)\s+/, "$1");
							enLevel=en_a[3] ? en_a[3] : 0;
							//top.Chat.am("Name '"+enName+"', Level '"+enLevel+"', ");
							
							if(enName && enLevel)
								CheckEnemy=(oBattle.arrUsers[oBattle.sEnemy].sName.indexOf(enName)>=0 && oBattle.arrUsers[oBattle.sEnemy].nLevel==enLevel) ? true:CheckEnemy;
							else if(enName)
								CheckEnemy=(oBattle.arrUsers[oBattle.sEnemy].sName.indexOf(enName)>=0) ? true:CheckEnemy;
							else
								CheckEnemy=(oBattle.arrUsers[oBattle.sEnemy].nLevel==enLevel) ? true:CheckEnemy;

							//top.Chat.am("name+level find :"+CheckEnemy);
						}
						CheckRes=CheckEnemy ? CheckRes:false;
					}else if(j=='my_effect'){                             //-----------------------обработка своих эффектов
						//top.Chat.am(Res[j]);
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
							//top.Chat.am(k+'-'+me.arrEffects[k].sID+'-'+CheckEffect);
						}
						CheckRes=CheckEffect ? CheckRes:false;
					}else{                             //-----------------------обработка тактик для приема
						currRes=parseInt(oBattle.arrRes[j].innerHTML);
						//top.Chat.am(j+'-'+Res[j]+'?'+currRes);
						CheckRes=( (currRes>=parseInt(Res[j])) ? CheckRes : false);
					}
				}
				
				if(CheckRes && typeof(top.Battle.oBattle.arrMethods[id])=='object' && top.Battle.oBattle.arrMethods[id].oMethod.bEnable){
					top.Chat.am('<b>'+oBattle.arrMethods[id].oMethod.sText+'</b>');
					oBattle.ApplyMethod(top.Battle.oBattle.arrMethods[id].oMethod);
					this.setKickTimer(this.minTime*1000);
					return;
				}
				
			}
			
			//top.Chat.am("T="+this.timeAttack);
			if(this.timeAttack>=this.autotime){ //------------ Наносим удар если пора
				top.Chat.am('<b>Attack</b>');
				oBattle.Attack();
				this.timeAttack=0;
			}
			if(this.autotime)
				this.setKickTimer(this.minTime*1000);
			//top.Battle.oBattle.Attack();
		}catch(e){
			e.Function = 'autoKick';
        	combats_plugins_manager.logError(this,e);
		}
	  },
	
	  onloadHandler: function() {
		try {
			if (top.frames[3].location.href.search(/^http\:\/\/\w+\.combats\.(?:com|ru)\/battle\d*\.pl/)!=0)
				return;
			if(typeof(top.Battle.oBattle.Class)=='object'){
				if(!(top.Battle.oBattle.Class.Settings() & 1)) top.Battle.oBattle.Class.Settings(1); // ----------Упрощенный бой
				if(!(top.Battle.oBattle.Class.Settings() & 8)) top.Battle.oBattle.Class.Settings(8); // ---------Не сбрасывать выбор
			}			
			//top.Chat.am('reload');
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
	
	  init: function() {
		
		var t = external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"autotime","90");
		this.autotime = parseInt(t); //----------- время в секундах до самостоятельного удара
		var t = external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"refresh","10");
		this.minTime = parseInt(t); // --------- минимальное время в секундах для обновления

		for(i=1;i<=20;i++){ // считывание приемов
			t=external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"Method"+i,"");
			if(a=t.match(/(\S+)\s*([^;]*).*/)){ // ----- отделяем прием от параметров
				var Method=new Object();
				Method['id']= a[1];
				if(a[2]){
					b=a[2].split(/\s*,\s*/); // ---------- разделяем параметры
					Method['Res']={};
					for(j in b){
						c=b[j].split(/\s*:\s*/); // о----------- тделяем название параметра от величины
						Method['Res'][c[0]]=c[1];
					}
				}
				if(Method['id'])
					this.MethodPriority.push(Method);
			}
		}

		top.combats_plugins_manager.attachEvent('mainframe.load',top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
		this.onloadHandler();
	  }
	}.init();
})()
