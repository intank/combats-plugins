(function() {
	return {
	  maxMethods: 20,
	  maxSpells: 10,
	  autotime: 0,
	  kickTimer: null,
	  minTime: 5,
	  timeAttack: 0,
	  MethodPriority: [],
	  BusyCount: 0,
	  diagnostics: false,
	  usedTactics: '',

	  toString: function() {
		return "Предотвращение тайм-аута (автобой)"; 
	  },

	  getProperties: function() {
	  	var section = top.getCookie('battle')+(this.usedTactics?'.'+this.usedTactics:'');
	  	var Methods = [];
		for(i=1;i<=this.maxMethods;i++){ // считывание приемов
			var t=external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",section,"Method"+i,"");
			if (t) {
				Methods.push(t);
			}
		}
	  	var Spells = [];
		for(i=1;i<=this.maxSpells;i++){ // считывание приемов
			var t=external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",section,"Spell"+i,"");
			if (t) {
				Spells.push(t);
			}
		}

		return [
			{ name:"Активен", value: this.active },
			{ name:"Время автоудара (сек)", value: this.autotime },
			{ name:"Время обновления (сек)", value: this.minTime },
			{ name:"Время перезагрузки при зависании (сек)", value: this.totalRefreshTime },
			{ name: 'Использовать оружие', value: this.useWeapon },
			{ name: 'Название тактики', value: this.usedTactics },
			{ name:"Свитки", value:Spells.join('\n'), type: 'textarea' },
			{ name:"Приёмы", value:Methods.join('\n'), type: 'textarea' },
			{ name: 'Приоритет противников', value:this.enemy_priority.join(',') },
			{ name: 'Диагностика', value: this.diagnostics },
			{ name: 'Показать боевые приёмы', value:this.showMethods }
		];
	  },
	
	  setProperties: function(a) {
		this.active=a[0].value;
		this.autotime=parseFloat(a[1].value);
		this.minTime=parseFloat(a[2].value);
		this.totalRefreshTime=parseFloat(a[3].value);
		this.useWeapon=a[4].value;

		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"autotime",""+this.autotime);
		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"refresh",""+this.minTime);
		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"totalRefreshTime",""+this.totalRefreshTime);
		external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",top.getCookie('battle'),"useWeapon",""+this.useWeapon);

		var save = true;
		if (this.usedTactics != a[5].value) {
			this.usedTactics = a[5].value;
			external.m2_writeIni(
				top.combats_plugins_manager.security_id,
				"Combats.RU",
				"antitimeout\\antitimeout.ini",
				top.getCookie('battle'),
				"usedTactics",
				this.usedTactics);
			save = top.confirm('Внимание!!!\n\nСохранить указанную тактику под именем "'+a[5].value+'"?\nНажатие кнопки "Отмена" приведёт к перезагрузке тактики с именем "'+a[5].value+'"');
		}
		if (save) {
		  	var section = top.getCookie('battle')+(this.usedTactics?'.'+this.usedTactics:'');
			var Spells = a[6].value.split(/[\n\r]+/);
			for(var i=0;i<this.maxSpells;i++) {
				if (!Spells[i])
					Spells[i] = '';
				external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",section,"Spell"+(i+1),Spells[i]);
			}
			var Methods = a[7].value.split(/[\n\r]+/);
			for(var i=0;i<this.maxMethods;i++) {
				if (!Methods[i])
					Methods[i] = '';
				external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",section,"Method"+(i+1),Methods[i]);
			}
			external.m2_writeIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",section,"enemy_priority",a[8].value);
		}
		this.diagnostics=a[9].value;

		this.LoadMethods();
		this.checkActive();
	  },

	  showMethods: function() {
	  	if (!top.Battle.oBattle || !top.Battle.oBattle.arrMethods)
	  		return;
	  	for(var i in top.Battle.oBattle.arrMethods) {
	  		this.addChat(top.Battle.oBattle.arrMethods[i].oMethod.sText+':'+top.Battle.oBattle.arrMethods[i].oMethod.sID, true);
	  	}
	  },

	  snotify: function( sid, chk ) {
		top.frames['bottom'].window.document.Sound.SetVariable("Volume", 100);
		top.frames['bottom'].window.document.Sound.SetVariable("Sndplay",sid);
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

	  addChat: function(msg, fatal) {
	  	if (fatal)
		  	combats_plugins_manager.add_sys(msg);
	  },

	  readIni: function(param, def) {
		return external.m2_readIni(
			top.combats_plugins_manager.security_id,
			"Combats.RU",
			"antitimeout\\antitimeout.ini",
			top.getCookie('battle'),
			param,
			def);
	  },

	  Fix: function(){
	    try {
	      var sURL = top.Battle.oBattle.oQuery.sURL;
	      top.Battle.SetScript(sURL);
	      top.Battle.nRequests = 0;
	      top.Battle.oBattle.Send( null, true );
	    } catch(e) {
	      this.addChat('Ошибка инициализации поединка', true);
	    }
	  },

	  scanGroups: function() {
		if (this.groupsRefreshed) return;
		this.groups = {};
		this.myGroup = '';
		var oBattle = top.Battle.oBattle;
		var warriors = oBattle.oGroupsLayer.childNodes;
		for(var k=0; k<warriors.length; k++) {
			if (warriors[k].nodeName=='SPAN' && (match=warriors[k].className.match(/^UserBattleGroup(\d+)$/))) {
				if (!this.groups[match[1]]) this.groups[match[1]] = [];
				this.groups[match[1]].push({
					name:warriors[k].innerText,
					group:match[1],
					ready:(warriors[k].style.textDecoration=='underline')
				});
				if (warriors[k].innerText==oBattle.sMyLogin) {
					this.myGroup = match[1];
				}
			}
		}
		this.groupsRefreshed = true;
	  },

	  getEnemyCount: function() {
		this.scanGroups();
		var enemies = 0;
		for(var k in this.groups) {
			enemies += (k==this.myGroup)?0:this.groups[k].length;
		}
		return enemies;
	  },
	  
	  createMethodEff: function(eff) {
       		var oMethodEff = {};

       		var arrMethodEff=eff.split(/\s*\|\s*/);
       		for(var k in arrMethodEff) {
       			var match = arrMethodEff[k].match(/^([^\:]*?)(?:\:(.*?)\:(.*)|\:(\d+)|)$/);
       			if (!match)
       				continue;
       			oMethodEff[match[1]] = {};
       			if (match[4]) {
       				oMethodEff[match[1]].count = parseInt(match[4]);
       			} else {
	       			if (match[2]) {
       					var s = this.readIni(match[2]);
       					if (s)
       						oMethodEff[match[1]].regExp = new RegExp(s);
	       			}
       				if (match[3]) {
       					var s = this.readIni(match[3]);
       					if (s) {
       						var func;
       						oMethodEff[match[1]].func = eval('func='+s);
	       				}
       				}
       			}
       		}
       		return oMethodEff;
	  },

	  checkEff: function(fighter, oMethodEff) {
       		var effNegative = false;
       		var effPositive = false;
       		for(k in oMethodEff) {
       			if (k.charAt(0)=='-') {
       				effNegative = true;
       				break;
       			}
       		}
       		for(k in fighter.arrEffects){
       			var effect = fighter.arrEffects[k];
       			if (oMethodEff[effect.sID]) { // найден нужный эффект
       				if (oMethodEff[effect.sID].regExp) { // доп. проверка
       					var match = effect.sTitle.match(oMethodEff[effect.sID].regExp);
       					if (match) {
       						effPositive = oMethodEff[effect.sID].func(match);
       					}
       				} else if (oMethodEff[effect.sID].count) {
       					var match = effect.sStack ? effect.sStack.match(/x(\d+)/): ['x1','1'];
       					effPositive = match && parseInt(match[1])>=oMethodEff[effect.sID].count;
       				} else
       					effPositive = true;
       			} else if (oMethodEff['-'+effect.sID]) { // найден ненужный эффект
				if (oMethodEff['-'+effect.sID].count) {
					var match = effect.sStack ? effect.sStack.match(/x(\d+)/): ['x1','1'];
					effNegative = !match || parseInt(match[1])<oMethodEff['-'+effect.sID].count;
				} else
					effNegative = false;
			}
			//this.addChat(k+'-'+effect.sID+'-'+CheckEffect);
		}
		return effNegative || effPositive;
	  },

	  checkRes: function(Res, Mode) {
		var oBattle = top.Battle.oBattle;
   		var sName = this.enemy.sName;
   		//this.addChat(i+'-'+id);
   		var CheckRes=true;
   		for(var jj in Res){
   			var j = Res[jj].param;
   			var value = Res[jj].value;
   			if(j=='enemy' && this.enemy){
   			//-------------Обработка врага
   				var CheckEnemy=false;
   				//this.addChat(j+'-'+value);
   				en=value.split(/\s*\|\s*/);
   				//this.addChat(en);
   				for(k in en){
   					//this.addChat(k+'-'+en[k]);
   					en_a=en[k].match(/([А-яЁёa-zA-Z ]*)(\[\s*(\d+)\s*\]|)/);
   					enName=en_a[1].replace(/^\s*(.*?)\s*$/, "$1");
   					enLevel=en_a[3] ? en_a[3] : 0;
   					//this.addChat("Name '"+enName+"', Level '"+enLevel+"', ");
   					
   					if(enName && enLevel)
   						CheckEnemy=(sName.indexOf(enName)>=0 && this.enemy.nLevel==enLevel) ? true:CheckEnemy;
   					else if(enName)
   						CheckEnemy=(sName.indexOf(enName)>=0) ? true:CheckEnemy;
   					else
   						CheckEnemy=(this.enemy.nLevel==enLevel) ? true:CheckEnemy;

   					//this.addChat("name+level find :"+CheckEnemy);
   				}
   				CheckRes = CheckEnemy ? CheckRes:false;
   			}else if(j=='my_effect'){
   			//-----------------------обработка своих эффектов
   				//this.addChat(value);

   				if (!this.oMethodMyEff)
   					this.oMethodMyEff = {};
   				var oMethodEff = this.oMethodMyEff[Mode]
   				if (!oMethodEff) {
   					this.oMethodMyEff[Mode] = oMethodEff = 
   						this.createMethodEff(value);
   				}

   				CheckRes = CheckRes && this.checkEff(this.me, oMethodEff);
   			}else if(j=='enemy_effect' && this.enemy){
   			//-----------------------обработка эффектов противника
   				//this.addChat(value);

   				if (!this.oMethodEnemyEff)
   					this.oMethodEnemyEff = {};
   				var oMethodEff = this.oMethodEnemyEff[Mode]
   				if (!oMethodEff) {
   					this.oMethodEnemyEff[Mode] = oMethodEff = 
   						this.createMethodEff(value);
   				}

   				CheckRes = CheckRes && this.checkEff(this.enemy, oMethodEff);
   			}else if(j=='enemy_boss' && this.enemy){
   			//-----------------------если противник - босс
   				CheckRes = CheckRes && (this.enemy.nMaxHP=='100');
   			}else if(j=='message'){
   			//-----------------------результат использования приёма/заклинания
   				en=value.split(/\s*\|\s*/);
   				var checkMess = false;
   				if (this.lastMessage) {
   					for(k in en) {
   						if (this.lastMessage.indexOf(en[k])>=0) {
   							checkMess = true;
   							break;
   						}
   					}
   				}
   				CheckRes &= checkMess;
   			}else if(j=='enemy_ready'){
   			//-----------------------противник выставил удар
   				this.scanGroups();
   				for(var k in this.groups) {
   					if (k==this.myGroup) continue;
   					for(var l in this.groups[k]) {
   						if (this.groups[k][l].name==sName) {
   							CheckRes = CheckRes && this.groups[k][l].ready;
   							this.addChat(this.groups[k][l].name+': '+(this.groups[k][l].ready?'готов':'не готов',true));
   							break;
   						}
   					}
   				}
   			}else if(j=='all_enemies_ready'){
   			//-----------------------все противники выставили удар
   				this.scanGroups();
   				for(var k in this.groups) {
   					if (k==this.myGroup) continue;
   					for(var l in this.groups[k]) {
   						CheckRes = CheckRes && this.groups[k][l].ready;
   						this.addChat(this.groups[k][l].name+': '+(this.groups[k][l].ready?'готов':'не готов',true));
   					}
   				}
   			}else if(j=='enemy_max_hp' && this.enemy){
   				var Less=(value.indexOf('<')>=0);
   				var More=(value.indexOf('>')>=0);
   				var lvl = parseFloat(value.replace(/^.*?(\d+).*?$/,'$1'));
   				if (!isNaN(lvl)) {
   					CheckRes = CheckRes && (Less && this.enemy.nMaxHP<=lvl || More && this.enemy.nMaxHP>=lvl);
   				}
   			}else if(j=='enemy_hp' && this.enemy){
   			//-----------------------обработка уровня HP противника
   				var Less=(value.indexOf('<')>=0);
   				var More=(value.indexOf('>')>=0);
   				var Mode_percent=(value.indexOf('%')>=0);
   				var lvl = parseFloat(value.replace(/^.*?(\d+).*?$/,'$1'));
   				if (!isNaN(lvl)) {
   					CheckRes = CheckRes && (
   						!Mode_percent && (Less && this.enemy.nHP<=lvl || More && this.enemy.nHP>=lvl)
   						||
   						Mode_percent && (Less && this.enemy.nHP/this.enemy.nMaxHP*100<=lvl || More && this.enemy.nHP/this.enemy.nMaxHP*100>=lvl)
   					);
   				}
   			}else if(j=='my_hp'){
   			//-----------------------обработка своего уровня HP
   				var Less=(value.indexOf('<')>=0);
   				var More=(value.indexOf('>')>=0);
   				var Mode_percent=(value.indexOf('%')>=0);
   				var lvl = parseFloat(value.replace(/^.*?(\d+).*?$/,'$1'));
   				if (!isNaN(lvl)) {
   					CheckRes = CheckRes && (
   						!Mode_percent && (Less && this.me.nHP<=lvl || More && this.me.nHP>=lvl)
   						||
   						Mode_percent && (Less && this.me.nHP/this.me.nMaxHP*100<=lvl || More && this.me.nHP/this.me.nMaxHP*100>=lvl)
   					);
   				}
   			}else if(j=='my_mana'){
   			//-----------------------обработка своего уровня маны
   				var Less=(value.indexOf('<')>=0);
   				var More=(value.indexOf('>')>=0);
   				var Mode_percent=(value.indexOf('%')>=0);
   				var lvl = parseFloat(value.replace(/^.*?(\d+).*?$/,'$1'));
   				if (!isNaN(lvl)) {
   					CheckRes = CheckRes && (
   						!Mode_percent && (Less && this.me.nMagic<=lvl || More && this.me.nMagic>=lvl)
   						||
   						Mode_percent && (Less && this.me.nMagic/this.me.nMaxMagic*100<=lvl || More && this.me.nMagic/this.me.nMaxMagic*100>=lvl)
   					);
   				}
   			}else if(j=='enemy_cnt'){
   			//-----------------------обработка количества противников
   				var Less=(value.indexOf('<')>=0);
   				var More=(value.indexOf('>')>=0);
   				var cnt = parseFloat(value.replace(/^.*?(\d+).*?$/,'$1'));
   				if (!isNaN(cnt)) {
   					var enemies = this.getEnemyCount();
   					CheckRes = CheckRes && (Less && enemies<cnt || More && enemies>cnt);
   				}
   			}else if(j=='available'){
   				if (value.charAt(0)=='-') {
   					value = value.substr(1);
   					if (typeof(oBattle.arrMethods[value])=='object' && oBattle.arrMethods[value].oMethod.bEnable)
	   					CheckRes = false;
   				} else {
   					if (typeof(oBattle.arrMethods[value])!='object' || !oBattle.arrMethods[value].oMethod.bEnable)
   						CheckRes = false;
   				}
   			}else if(j=='my_effect_turn'){
   				var match = value.match(/^\s*([^\:]+)\s*\:\s*(\d+|\+|-)/);
   				if (match) {
   					var searchText = match[1];
   					var searchUsed = '';
   					var turn;
   					if (match[2]=='+') searchUsed = '+';
   					else if (match[2]=='-') searchUsed = '-';
   					else turn = parseInt(match[2]);
   					var log = top.User.Framework.GetTab('alllog').Frame();
   					var CheckEffTurn = false
   					for(var k=0; k<log.childNodes.length; k++) {
   						var logLine = log.childNodes[k].innerText || log.childNodes[k].nodeValue || '';
   						if (logLine=='') {
   							if (!searchUsed && --turn<0) {
   								break;
   							}
   						} else if (logLine.indexOf('"'+searchText+'"')>=0) {
   							if (logLine.indexOf('Закончилось действие эффекта')<0) {
   								if (searchUsed || turn==0)
   									CheckEffTurn = true;
   								break;
   							}
   						}
   					}
   					if (searchUsed=='-') { // проверка, что приём вообще не использовался
   						CheckEffTurn = !CheckEffTurn;
   					}

   					CheckRes = CheckRes && CheckEffTurn;
   				}
   			}else{
   			//-----------------------обработка тактик для приема
   				if (j in oBattle.arrRes) {
   					currRes=parseInt(oBattle.arrRes[j].innerHTML);
   					//this.addChat(j+'-'+value+'?'+currRes);
   					CheckRes=( (currRes>=parseInt(value)) ? CheckRes : false);
   				} else {
   					this.addChat(id+', unknown: '+j, true);
   					CheckRes=false;
   				}
   			}
   		}
   		return CheckRes;
	  },

	  autoKick: function() {
	  	var diagnostics = this.diagnostics;
	  	if (!this.active)
	  		return;
		try {
			if( (typeof(top.Battle.oBattle )!="object") && !top.Battle.bInBattle) //------- А есть ли бой???
				return;
			var oBattle=top.Battle.oBattle;

			// отобразить кнопку отключения автобоя
			if (!this.stopButton) {
				this.stopButton = oBattle.arrButtons['commit'].document.createElement('BUTTON');
				this.stopButton.innerHTML = 'STOP';
				this.stopButton.style.background = '#D00000';
				this.stopButton.style.color = '#FFFF80';
				this.stopButton.onclick = combats_plugins_manager.get_binded_method(this,
					function(){ this.active = false; } );
			}
			if (this.stopButton.parentNode!=oBattle.arrButtons['commit'].parentNode) {
				oBattle.arrButtons['commit'].parentNode.insertBefore(
					this.stopButton,
					oBattle.arrButtons['commit']);
			}
			this.timeAttack+=this.minTime;

			//this.addChat('Checking..................'+this.timeAttack);
			if(oBattle.bGameOver){ //---------------- Гейм оувер
				this.addChat('Game over');
				top.Battle.End(oBattle.sLocation);
				return;
			}
			if (oBattle.oError.innerHTML) {
				this.lastMessage = oBattle.oError.innerHTML;
			}
			if( oBattle.nRequests ) { //------------------- Если занято, обновляем и ждем minTime сек
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
			
			this.me=null;
			this.enemy=null;
			for(k in oBattle.arrUsers) {
				if(oBattle.arrUsers[k].sName==oBattle.sMyLogin){
					this.me=oBattle.arrUsers[k];
					break;
				}
			}
			this.enemy = oBattle.arrUsers[oBattle.sEnemy];
			var diag_str = combats_plugins_manager.serialize(this.me)+'<BR>'+combats_plugins_manager.serialize(this.enemy);
			diag_str += '<BR>(';
			for(var id in oBattle.arrMethods) {
				var	s = id + ':';
				if (oBattle.arrMethods[id].oMethod) {
					s += oBattle.arrMethods[id].oMethod.bEnable;
				} else {
					s += 'null';
				}
				diag_str += s + ' * ';
			}
			diag_str += ')';
			this.groupsRefreshed = false;
			var attack = false;

			//------ Свитки
			for(var i=0;i<this.SpellsPriority.length;i++){
				var id=this.SpellsPriority[i].id;
				for(var j=0;j<oBattle.arrScrolls.length;j++) {
					if (!oBattle.arrScrolls[j].arrMagic 
					    || !oBattle.arrScrolls[j].arrMagic.length 
					    || id!=oBattle.arrScrolls[j].arrMagic[0].sID
					    || !oBattle.arrScrolls[j].arrMagic[0].bEnable) continue;
					var CheckRes = this.checkRes(this.SpellsPriority[i].Res,"Spell"+i);
					
					if(CheckRes) {
						var oButton = oBattle.arrScrolls[j];
						oButton.click();
						if (oButton.arrMagic[0].bSelectTarget) {
							if (oButton.arrMagic[0].sTarget=='friend')
								top.Window.oPrompt.oValue.value = oBattle.sMyLogin;
							else {
								// стреляем по противнику, нужно выбрать сильнейшую цель
								top.Window.oPrompt.oValue.value = this.getStrongName();
							}
							top.Window.oPrompt.oOk.Apply();
						} else { // if (!oButton.arrMagic[0].bFreeCast) 
							top.Window.oConfirm.oOk.Apply();
						}

						this.setKickTimer(this.minTime*1000);
						return;
					} else {
						diag_str += ', not match: '+id;
					}
				}
			}

			//------ Приемы
			for(var i=0;i<this.MethodPriority.length;i++){
				var id=this.MethodPriority[i].id;
				
				if (id!='*' && (typeof(oBattle.arrMethods[id])!='object' || !oBattle.arrMethods[id].oMethod.bEnable)) {
					diag_str += ', skip: '+id;
					continue;
				}

				var oMethod = (id == '*') ? null : oBattle.arrMethods[id].oMethod;
				var CheckRes = this.checkRes(this.MethodPriority[i].Res,"Method"+i);

				if(CheckRes){
					if (id=='*') {
						attack = true;
						diagnostics = true;
						this.snotify(3,'nocheck');
						break;
					}
					this.addChat('<b>'+oMethod.sText+'</b> '+(diagnostics?diag_str:''),diagnostics);
					var oButton = oBattle.arrMethods[id];
					oButton.click();
					if (oButton.oMethod.bSelectTarget) {
						if (oButton.oMethod.sTarget=='friend')
							top.Window.oPrompt.oValue.value = oBattle.sMyLogin;
						else {
							// стреляем по противнику, нужно выбрать сильнейшую цель
							top.Window.oPrompt.oValue.value = this.getStrongName();
						}
						top.Window.oPrompt.oOk.Apply();
					} else if (!oButton.oMethod.bFreeCast) {
						top.Window.oConfirm.oOk.Apply();
					}

					this.setKickTimer(this.minTime*1000);
					return;
				} else {
					diag_str += ', not match: '+id;
				}
				
			}
			
			//this.addChat("T="+this.timeAttack);
			if(this.timeAttack>=this.autotime && (attack || this.useWeapon || oBattle.sEnemyLogin==oBattle.sMyLogin)){
			//------------ Наносим удар если пора
				this.addChat('<b>Attack</b>'+(diagnostics?diag_str:''),diagnostics);
				var battle_attack = combats_plugins_manager.plugins_list['battle_attack'];
				if (battle_attack)
					battle_attack.doAttack();
				else
					oBattle.Attack();
				this.timeAttack=0;
			} else {
				this.addChat('too early to kick'+(diagnostics?diag_str:''),diagnostics);
			}
//			if(this.autotime)
			this.setKickTimer(this.minTime*1000);
			oBattle.Refresh();
			//top.Battle.oBattle.Attack();
		}catch(e){
			e.Function = 'autoKick';
			e.diag = diag_str;
        		combats_plugins_manager.logError(this,e);
		}
	  },

	  getStrongName: function() {
		this.scanGroups();
		var strongest_index = 1000;
		var strongest = '';
		for(var k in this.groups) {
			if (k==this.myGroup) continue;
			for(var l in this.groups[k]) {
				var name = this.groups[k][l].name.toUpperCase();
				for(var m in this.enemy_priority) {
					if (name.indexOf(this.enemy_priority[m])>=0) {
						if (strongest_index>m) {
							strongest_index = m;
							strongest = this.groups[k][l].name;
						}
					}
				}
			}
		}
		return strongest || top.Battle.oBattle.sEnemyLogin;
	  },
	
	  onloadHandler: function() {
		if (!this.active)
			return;
		try {
			if (top.combats_plugins_manager.getMainFrame().location.href.search(/^http\:\/\/\w+\.combats\.(?:com|ru)\/battle\d*\.pl/)!=0)
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
			
			top.combats_plugins_manager.getMainFrame().attachEvent( "onbeforeunload", top.combats_plugins_manager.get_binded_method(this,this.clearKickTimer));
		}catch(e){
			e.Function = 'onLoadHandler';
        	combats_plugins_manager.logError(this,e);
		}
	  },

	  setTactics: function(tactics) {
	  	this.usedTactics = tactics || '';
	  	this.LoadMethods();
		external.m2_writeIni(
			top.combats_plugins_manager.security_id,
			"Combats.RU",
			"antitimeout\\antitimeout.ini",
			top.getCookie('battle'),
			"usedTactics",
			this.usedTactics);
	  },

	  LoadMethod: function(method_index, section) {
   		var t=external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",section,method_index,"");
   		var a=t.match(/^(\S+)(?:\s+(.*?)|)\s*(?:;.*?|)$/);
   		if(a){ // ----- отделяем прием от параметров
   			var Method=new Object();
   			Method['id']= a[1];
   			if(a[2]){
   				b=a[2].split(/\s*,\s*/); // ---------- разделяем параметры
   				Method['Res']=[];
   				for(j in b){
   					c=b[j].split(/\s*:\s*/); // ----------- отделяем название параметра от величины
   					Method['Res'].push({param:c[0],value:c.slice(1).join(':')});
   				}
   			}
			return Method;
   		}
	  },

	  LoadMethods: function() {
	  	this.oMethodMyEff = null;
	  	this.oMethodEnemyEff = null;
	  	this.MethodPriority = [];
	  	this.SpellsPriority = [];
	  	var section = top.getCookie('battle')+(this.usedTactics?'.'+this.usedTactics:'');

	  	this.maxMethods = parseInt(external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",section,'maxMethods','0')) || 20;
	  	this.maxSpells = 10;
		for(var i=1;i<=this.maxMethods;i++){ // считывание приемов
			var Method = this.LoadMethod("Method"+i,section);
   			if(Method && Method['id'])
   				this.MethodPriority.push(Method);
		}
		for(var i=1;i<=this.maxSpells;i++){ // считывание свитков
			var Spell = this.LoadMethod("Spell"+i,section);
   			if(Spell && Spell['id'])
   				this.SpellsPriority.push(Spell);
		}
		var enemy_priority=external.m2_readIni(top.combats_plugins_manager.security_id,"Combats.RU","antitimeout\\antitimeout.ini",section,"enemy_priority","");
		this.enemy_priority = enemy_priority.toUpperCase().split(/\s*,\s*/);
		for(var i=this.enemy_priority.length-1; i>=0; i--) {
			if (!this.enemy_priority[i]) {
				this.enemy_priority.splice(i,1);
			}
		}
	  },

	  init: function() {
		
		this.active = false; //----------- плагин активен
		var t = this.readIni("autotime","90");
		this.autotime = parseFloat(t); //----------- время в секундах до самостоятельного удара
		var t = this.readIni("refresh","10");
		this.minTime = parseFloat(t); // --------- минимальное время в секундах для обновления
		var t = this.readIni("totalRefreshTime","45");
		this.totalRefreshTime = parseFloat(t) || 0; // --------- время в секундах для полного обновления окна при зависании
		this.useWeapon = this.readIni("useWeapon","true")!='false';
		this.setTactics(this.readIni("usedTactics",""),true);

		top.combats_plugins_manager.attachEvent('mainframe.load',
			top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
		this.onloadHandler();
		return this;
	  }
	}.init();
})()
