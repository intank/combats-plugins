(function() {
	return {
	  autotime: 0,
	  kickTimer: null,
	  minTime: 5,
	  timeAttack: 0,
	  MethodPriority: [],
	  BusyCount: 0,

	  toString: function() {
		return "�������������� ����-���� (�������)"; 
	  },

	  getProperties: function() {
	  	var Methods = [];
		for(i=1;i<=20;i++){ // ���������� �������
			var t=this.readIni("Method"+i,"");
			if (t) {
				Methods.push(t);
			}
		}

		return [
			{ name:"�������", value: this.active },
			{ name:"����� ��������� (���)", value: this.autotime },
			{ name:"����� ���������� (���)", value: this.minTime },
			{ name:"����� ������������ ��� ��������� (���)", value: this.totalRefreshTime },
			{ name: '������������ ������', value: this.useWeapon },
			{ name:"�������", value:Methods.join('\n'), type: 'textarea' }
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

		var Methods = a[5].value.split(/[\n\r]+/);
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
	      var sURL = top.Battle.oQuery.sURL;
	      top.Battle.SetScript(sURL);
	      top.Battle.nRequests = 0;
	      top.Battle.oBattle.Send( null, true );
	    } catch(e) {
	      this.addChat('������ ������������� ��������');
	    }
	  },

	  autoKick: function() {
	  	if (!this.active)
	  		return;
		try {
			if( (typeof(top.Battle.oBattle )!="object") && !top.Battle.bInBattle) //------- � ���� �� ���???
				return;
			oBattle=top.Battle.oBattle;
			this.timeAttack+=this.minTime;

			//this.addChat('Checking..................'+this.timeAttack);
			if(top.Battle.oBattle.bGameOver){ //---------------- ���� �����
				this.addChat('Game over');
				top.Battle.End(top.Battle.oBattle.sLocation);
				return;
			}
			if( top.Battle.oBattle.nRequests ) { //------------------- ���� ������, ��������� � ���� minTime ���
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
			
			//------ ������
			for(i=0;i<this.MethodPriority.length;i++){
				id=this.MethodPriority[i].id;
				Res=this.MethodPriority[i].Res;
				//this.addChat(i+'-'+id);
				CheckRes=true;
				for(j in Res){
					if(j=='enemy'){                                //-------------��������� �����
						CheckEnemy=false;
						//this.addChat(j+'-'+Res[j]);
						en=Res[j].split(/\s*\|\s*/);
						//this.addChat(en);
						for(k in en){
							//this.addChat(k+'-'+en[k]);
							en_a=en[k].match(/([�-� ]*)(\[\s*(\d+)\s*\])?/);
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
					}else if(j=='my_effect'){                             //-----------------------��������� ����� ��������
						//this.addChat(Res[j]);

						if (typeof(Res[j])=='string') {
							var c=Res[j].split(/\s*\|\s*/);
							Res[j]={};
							for(var k in c) {
								c[k] = c[k].match(/^([^\:]+)(?:\:(.*?)|)$/);
								if (c[k][1].indexOf('-')==0) {
									c[k][1] = c[k][1].slice(1);
									Res[j][c[k][1]] = {
										positive: false
									};
								} else {
									if (c[k][2]) {
										var func_str = this.readIni(c[k][2],'null');
										var func;
										func = eval('func='+func_str);
										Res[j][c[k][1]] = {
											positive: true,
											'function': func
										};
									} else {
										Res[j][c[k][1]] = {
											positive: true
										};
									}
								}
							}
						}

						for(k in oBattle.arrUsers){
							if(oBattle.arrUsers[k].sName==oBattle.sMyLogin){
								me=oBattle.arrUsers[k];
								break;
							}
						}
						var myEff = {};
						for(var k in me.arrEffects){
							myEff[me.arrEffects[k].sID] = me.arrEffects[k];
						}
						
						CheckEffect = false;
						for(var k in Res[j]){
							if (!(k in myEff) && !Res[j][k].positive 
							    || (k in myEff) && Res[j][k].positive && (Res[j][k]['function']==null || Res[j][k]['function'](myEff[k].sTitle)))
							{
								CheckEffect = true;
								break;
							}
						}

						CheckRes &= CheckEffect;
					}else if(j=='my_hp'){              //-----------------------��������� ������ ������ HP
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
					}else if(j=='enemy_cnt'){              //-----------------------��������� ������ ������ HP
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
					}else{                             //-----------------------��������� ������ ��� ������
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
			if(this.timeAttack>=this.autotime && this.useWeapon){ //------------ ������� ���� ���� ����
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
				if(!(top.Battle.oBattle.Class.Settings() & 1)) top.Battle.oBattle.Class.Settings(1); // ----------���������� ���
				if(!(top.Battle.oBattle.Class.Settings() & 8)) top.Battle.oBattle.Class.Settings(8); // ---------�� ���������� �����
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
		for(i=1;i<=20;i++){ // ���������� �������
			var t=this.readIni("Method"+i,"");
			if(a=t.match(/(\S+)\s*([^;]*).*/)){ // ----- �������� ����� �� ����������
				var Method=new Object();
				Method['id']= a[1];
				if(a[2]){
					b=a[2].split(/\s*,\s*/); // ---------- ��������� ���������
					Method['Res']={};
					for(j in b){
						c=b[j].split(/\s*:\s*/); // ----------- �������� �������� ��������� �� ��������
						Method['Res'][c[0]]=c.slice(1).join(':');
					}
				}
				if(Method['id'])
					this.MethodPriority.push(Method);
			}
		}
		this.scripts = [];
		for(i=1;i<=20;i++){ // ���������� ��������
			var t=this.readIni("Script"+i,"");
			if (!t) continue;
			try {
				var s = external.readFile( top.combats_plugins_manager.security_id, 'Combats.RU', 'antitimeout\\'+t+'.js');
			        if (!t) continue;
				this.scripts[i] =top.eval(s);
			} catch(e) {
				e.message = '�������� ������� �'+i+': '+e.message;
		        	combats_plugins_manager.logError(this,e);
			}
		}
	  },

	  init: function() {
		
		this.active = false; //----------- ������ �������
		var t = this.readIni("autotime","90");
		this.autotime = parseFloat(t); //----------- ����� � �������� �� ���������������� �����
		var t = this.readIni("refresh","10");
		this.minTime = parseFloat(t); // --------- ����������� ����� � �������� ��� ����������
		var t = this.readIni("totalRefreshTime","45");
		this.totalRefreshTime = parseFloat(t) || 0; // --------- ����� � �������� ��� ������� ���������� ���� ��� ���������
		this.useWeapon = this.readIni("useWeapon","true")!='false';
		
		this.LoadMethods();

		top.combats_plugins_manager.attachEvent('mainframe.load',
			top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
		this.onloadHandler();
		return this;
	  }
	}.init();
})()
