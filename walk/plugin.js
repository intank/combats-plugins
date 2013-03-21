(function() {
	return {
		"toString": function() {
			return "Бродилка по пещере";
		},

		markDanger: top.combats_plugins_manager.base_folder+'/walk/danger1.png',
		markObstacle: top.combats_plugins_manager.base_folder+'/walk/stop.png',
		markUseful: top.combats_plugins_manager.base_folder+'/walk/object.png',
		usedObjectsCleanup: 10, // количество минут до следующей очистки списка поюзаных объектов
		mapFileName: '',
		Map: null,
		defaultDungeonName: '',
		excludedItems: {},
		alwaysItems: {},
		locationCache: {},

		"bots": {
			'0/1209_qplghuk': {
				ids: {
					79: {
						style: { backgroundColor: '#CFCF00', border: '1px solid red' } 
					}
				}
			},
			'0/1212_aizpldd': {
				ids: {
					2: {
						style: { backgroundColor: '#CFCF00', border: '1px solid red' } 
					}
				}
			},
			'0/1207_zlqnggk': {
				ids: {
					130: {
						style: { backgroundColor: '#CFCF00', border: '1px solid red' } 
					}
				}
			},
			'0/1206_pzzlqik': {
				ids: {
					132: {
						style: { backgroundColor: '#CFCF00', border: '1px solid red' } 
					}
				}
			},
			'0/1213_baloszh': {
				style: { backgroundColor: '#CFCF00', border: '1px solid red' } 
			},
			
			'1/1040a_dr8472409823': {
				priority: 3, 
				style: { backgroundColor: '#EF00EF' }
			},
			'1/1040_vk8345642089': { 
				priority: 3, 
				style: { backgroundColor: '#EF00EF' }, 
// 9:57,34(д3),39,69
				ids: {
					57: {
						priority: 5, 
						title: '[11]',
						style: { backgroundColor: '#800080' } 
					},
					12: {
						priority: 5, 
						title: '[11]',
						style: { backgroundColor: '#800080' } 
					},
					28: {
						priority: 5, 
						title: '[11]',
						style: { backgroundColor: '#800080' } 
					},

					72: {
						priority: 4, 
						title: '[10]',
						style: { backgroundColor: '#A000A0' } 
					},
					42: {
						priority: 4, 
						title: '[10]',
						style: { backgroundColor: '#A000A0' } 
					},
					26: {
						priority: 4, 
						title: '[10]',
						style: { backgroundColor: '#A000A0' } 
					},
					67: {
						priority: 4, 
						title: '[10]',
						style: { backgroundColor: '#A000A0' } 
					},
					
					33: {
						priority: 4, 
						title: ' (марка)',
						style: { backgroundColor: '#A000A0' } 
					},
					53: {
						priority: 4, 
						title: '[10]',
						style: { backgroundColor: '#A000A0' } 
					},
					76: {
						priority: 4, 
						title: '[10]',
						style: { backgroundColor: '#A000A0' } 
					},
					56: {
						title: '[8]',
						style: { backgroundColor: '#FF10FF' } 
					},
					54: {
						title: '[8]',
						style: { backgroundColor: '#FF10FF' } 
					},
					1: {
						title: '[8]',
						style: { backgroundColor: '#FF10FF' } 
					}
				}
			},
			'1/1168_hqplbve': {
				priority: 6, 
				style: { backgroundColor: '#800080' } 
			},
			'0/1202_qzhaltv': {
				priority: 5, 
				style: { backgroundColor: '#A000A0' } 
			},
			'0/1181_fuyfuyf': {
				priority: 6, 
				style: { backgroundColor: '#800080' } 
			},
			'0/1176_aghoaaga': {
				priority: 4, 
				style: { backgroundColor: '#EF00EF' } 
			},
			'0/1178_ewwtyy': {
				priority: 4, 
				style: { backgroundColor: '#EF00EF' } 
			},
			'0/1044_kv7870496581': {
				priority: 6, 
				title: '[11]',
				style: { backgroundColor: '#200020' } 
			},
			'0/1041_rk0170592363': { 
				style: { backgroundColor: '#A04000' } 
			},
			'0/1019': {
				priority: 3, 
				style: { backgroundColor: '#EF00EF' }
			},
			'0/1050_pq6472859128': {
				priority: 3, 
				style: { backgroundColor: '#EF00EF' }
			},
			'1/1052_id8363592750': {
				priority: 3, 
				style: { backgroundColor: '#EF00EF' }
			},
			'0/1043_ro9557495117': {
			},
			'0/1332_xdjeqeq': {
				style: { backgroundColor: '#EFEF00', border: '1px solid green' }
			},
			'0/1331_onesixl': {
				style: { backgroundColor: '#EFEF00', border: '1px solid green' }
			},
			'1/1031_vilgeua': {
				style: { backgroundColor: '#EFEF00', border: '1px solid green' }
			},
			'1/1037_hlgfmet': {
				style: { backgroundColor: '#EFEF00', border: '1px solid green' }
			},
			'0/1392_arimesy': {
				style: { backgroundColor: '#EFEF00', border: '1px solid green' }
			},
			'0/1391_iosywjw': {
				style: { backgroundColor: '#EFEF00', border: '1px solid green' }
			},
			'0/1318_eghlgaj': {// муравир
				priority: 3, 
				style: { backgroundColor: '#EFEF00', border: '2px solid green' }
			},
			'1/1030_jjzopmm': {// эшшли
				priority: 3, 
				style: { backgroundColor: '#EFEF00', border: '2px solid green' }
			},
			'0/1316_mcfusag': {// ярувагр
				priority: 3, 
				style: { backgroundColor: '#EFEF00', border: '2px solid green' }
			},
			'0/1319_scdezcp': {// хтоновар
				priority: 3, 
				style: { backgroundColor: '#EFEF00', border: '2px solid green' }
			},
			'0/1317_fosdylr': {// лавизар
				priority: 3, 
				style: { backgroundColor: '#EFEF00', border: '2px solid green' }
			},
			'1/1029_ywqdvap': {// клеа
				priority: 3, 
				style: { backgroundColor: '#EFEF00', border: '2px solid green' }
			},
			'0/1308_nquvkme': {// гыгыбря
				priority: 3, 
				style: { backgroundColor: '#EFEF00', border: '2px solid green' }
			}
		},
		"load": function(key,def_val){
			return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","walk\\walk.ini",top.getCookie('battle'),key,def_val);
		},
		"save": function(key,val){
			external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","walk\\walk.ini",top.getCookie('battle'),key,val);
		},
		"getProperties": function() {
			var items = [];
			items[0] = [];
			for(var i in this.excludedItems) {
				items[0].push(i);
			}
			items[1] = [];
			for(var i in this.alwaysItems) {
				items[1].push(i);
			}
			return [
				{ name: "\"Опережающий\" таймер", value: this.forced },
				{ name: "Игнорировать препятствия", value: this.ignoreWall },
				{ name: "Отображать монстров на радаре", value: this.showUnits },
				{ name: "Отображать объекты на радаре", value: this.showObjects },
				{ name: "Скрывать карту, если открыто не подземелье", value: this.autoHideMap },
				{ name: "Минимум HP для автонападения (%)", value: this.minHP},
				{ name: "Минимум маны для автонападения (%)", value: this.minMana},
				{ name: "Принудительное время ожидания шага", value: this.forcedStepTime},
				{ name: "Список исключенных из автокликера объектов", value: this.excludedObjects, type:"textarea"},
				{ name: "Список объектов, на которые нужно кликать <b>всегда</b>", value: items[1].join("\n"), type:"textarea"},
				{ name: "Предметы, которые не нужно поднимать", value: items[0].join("\n"), type:"textarea"},
				{ name: "Название подземелья в <b>"+this.cityName+"</b>, если не удалось определить автоматически", value: this.defaultDungeonName },
				{ name: "Включать вывод системных сообщений", value: {
					'length': 3,
					0: 'Никогда',
					1: 'Только если с командой',
					2: 'Всегда',
					'selected': this.sysMode
				} },
				{ name: "Минимальное время обновления (сек)", value: this.randomWaitTimeMin },
				{ name: "Случайная составляющая времени обновления (сек)", value: this.randomWaitTimeMax },
				{ name: "Кликать по объектам по умолчанию", value: this.auto_en_click },
				{ name: "Собирать ингридиенты по умолчанию", value: this.auto_mat_click },
				{ name: "Всегда отказываться от спорных предметов", value: this.mat_abandon_contest },
				{ name: "Останавливать при перегрузе", value: this.enableNoPlaceAlert },
				{ name: "Минимум здоровья для шага", value: this.minSafeHP },
				{ name: "Журнал", value: this.log.join("\n"), type:"textarea"}
			];
		},

		"setProperties": function(a) {
			this.forced=a[0].value;
			this.ignoreWall=a[1].value;
			this.showUnits=a[2].value;
			this.showObjects=a[3].value;
			this.autoHideMap=a[4].value;
			this.minHP=Math.max(0, Math.min(parseFloat(a[5].value) || 0, 100));
			this.minMana=Math.max(0, Math.min(parseFloat(a[6].value) || 0, 100));
			this.forcedStepTime = parseFloat(a[7].value) || 0;
			this.excludedObjects=a[8].value;
			this.alwaysItems = {};
			var items = a[9].value.split(/\s*[\n\r;]+\s*/);
			for(var i=0; i<items.length; i++)
				this.alwaysItems[items[i]] = true;
			this.excludedItems = {};
			items = a[10].value.split(/\s*[\n\r;]+\s*/);
			for(var i=0; i<items.length; i++)
				this.excludedItems[items[i]] = true;
			this.defaultDungeonName = a[11].value;
			this.sysMode = a[12].value.selected;
			this.randomWaitTimeMin = Math.max(10,parseFloat(a[13].value) || 0);
			this.randomWaitTimeMax = parseFloat(a[14].value) || 0;
			this.auto_en_click = a[15].value;
			this.auto_mat_click = a[16].value;
			this.mat_abandon_contest = a[17].value;
			this.enableNoPlaceAlert = a[18].value;
			this.minSafeHP = parseFloat(a[19].value);

			this.save('forced',this.forced?"yes":"no");
			this.save('ignoreWall',this.ignoreWall?"yes":"no");
			this.save('showUnits',this.showUnits?"yes":"no");
			this.save('showObjects',this.showObjects?"yes":"no");
			this.save('autoHideMap',this.autoHideMap?"yes":"no");
			this.save('minHP',this.minHP.toString());
			this.save('minMana',this.minMana.toString());
			this.save('forcedStepTime',this.forcedStepTime.toString());
			this.save('exclude',this.excludedObjects.replace(/\s*[\n\r]+\s*/g,";"));
			this.save('alwaysItems',a[9].value.replace(/\s*[\n\r]+\s*/g,";"));
			this.save('excludedItems',a[10].value.replace(/\s*[\n\r]+\s*/g,";"));
			this.save(this.cityName+'.defaultDungeonName',this.defaultDungeonName);
			this.save('sysMode',this.sysMode.toString());
			this.save('randomWaitTimeMin',this.randomWaitTimeMin.toString());
			this.save('randomWaitTimeMax',this.randomWaitTimeMax.toString());
			this.save('auto_en_click',this.auto_en_click.toString());
			this.save('auto_mat_click',this.auto_mat_click.toString());
			this.save('mat_abandon_contest',this.mat_abandon_contest.toString());
			this.save('enableNoPlaceAlert',this.enableNoPlaceAlert.toString());
			this.save('minSafeHP',this.minSafeHP.toString());
		},

		addSys: function(s) {
			combats_plugins_manager.add_sys(s);
		},

		"clearLog": function() {
			this.log = [];
		},

		"addLog": function(s) {
			this.log.push(s);
		},

		"setDirection": function(a) {
			if(this.Direction) {
				img=top.combats_plugins_manager.getMainFrame().document.all("i"+this.Direction);
				img.src=img.src.replace(/b\.gif$/,".gif");
			}
			this.Direction=a;
			img=top.combats_plugins_manager.getMainFrame().document.all("i"+this.Direction);
			img.src=img.src.replace(/b?\.gif$/,"b.gif");
			top.combats_plugins_manager.getMainFrame().document.all("td_stop").style.backgroundColor="black";
			if (this.ignoreWall || top.combats_plugins_manager.getMainFrame().document.getElementById("m"+this.Direction) && this.steptimer==null) {
				var mtime = top.combats_plugins_manager.getMainFrame().mtime*(1-(top.combats_plugins_manager.getMainFrame().progressAt/top.combats_plugins_manager.getMainFrame().progressEnd));
				if (mtime<0)
					mtime = 0;
				this.StartStepTimer(this.do_step, mtime);
			}
			this.setCurrentSettings();
		},

		"StartStepTimer": function(do_step, sec) {
			try {
				if(this.steptimer!=null)
					clearTimeout(this.steptimer);
				this.steptimer=setTimeout(top.combats_plugins_manager.get_binded_method(this,do_step),1000*sec+100);
			} catch(e) {
				e.Function = 'StartStepTimer';
				combats_plugins_manager.logError(this,e);
			}
		},
			
		"stop_it": function() {
			if(this.Direction) {
				var img=top.combats_plugins_manager.getMainFrame().document.getElementById("i"+this.Direction);
				if (img) img.src=img.src.replace(/b\.gif$/,".gif");
			}
			this.Direction=0;
			var td=top.combats_plugins_manager.getMainFrame().document.all("td_stop")
			if (td) td.style.backgroundColor="red";
			if(this.steptimer!=null){
				clearTimeout(this.steptimer);
				this.steptimer=null;
			}
			this.setCurrentSettings();
		},
			
		"do_step": function() {
			try {
				clearTimeout(this.steptimer);
				this.steptimer=null;

				var canStep = true;

				if (this.Direction==1) {
					var oLayer;
					var oObjects;
					if ((oLayer = top.combats_plugins_manager.getMainFrame().document.getElementById('1_0l')))
						oObjects = oLayer.getElementsByTagName('button');
						for (var i=0; i<oObjects.length; i++)
							if (oObjects[i].currentStyle.filter.search(/src=.?http\:\/\/img\.combats\.(?:com|ru)\/i\/chars\/d\//)>=0
								&& (oObjects[i].nextSibling==null || oObjects[i].nextSibling.className!='Life'))
							{
								canStep = false;
								break;
							}
				}

				if(this.Direction>0 && canStep) {
					top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+"?rnd="+Math.random()+"&path=m"+this.Direction;
					if(this.forced)
						this.StartStepTimer(this.do_step, 15);
				}
			} catch(e) {
				e.Function = 'do_step';
				combats_plugins_manager.logError(this,e);
			}
		},
			
		"onunloadHandler": function(){
			try {
				if (this.forced)
					return;
				clearTimeout(this.steptimer);
				this.steptimer=null;
			} catch(e) {
				e.Function = 'onunloadHandler';
				combats_plugins_manager.logError(this,e);
			}
		},

		"clearUsedObjects": function() {
			this.usedObjects={};
			setTimeout(top.combats_plugins_manager.get_binded_method(this,this.clearUsedObjects),this.usedObjectsCleanup*60*1000);
			this.skip_quest = false;
		},

		"setCurrentSettings": function() {
			try {
				this.en_click=top.combats_plugins_manager.getMainFrame().document.all['en_click'].checked;
				this.mat_click=top.combats_plugins_manager.getMainFrame().document.all['mat_click'].checked;
				this.autoPilot=top.combats_plugins_manager.getMainFrame().document.all['autoPilot'].checked;
				this.autoAttack=top.combats_plugins_manager.getMainFrame().document.all['autoAttack'].checked;
				this.showMap=top.combats_plugins_manager.getMainFrame().document.all['showMap'].checked;
			} catch(e) {
			}
			var t=this.Direction;
			t=this.en_click ? (t | 8):(t & 247);
			t=this.mat_click ? (t | 16):(t & 239);
			t=this.ignoreWall ? (t | 32):(t & 223);
			t=this.autoPilot ? (t | 64):(t & 191);
			t=this.autoAttack ? (t | 128):(t & 127);
		
			document.cookie = "walkSettings=" + t + ";";
		},

		"onloadHandler": function() {
			try {
				var d=top.combats_plugins_manager.getMainFrame().document;
				if(d.location.pathname.search(/^\/dungeon\d*\.pl/)!=0) {
					if (this.autoHideMap)
						this.doHideMap();
					return;
				}
	var doc_inner=d.body.innerHTML.toString(); // ----------- Added by Solt
	var cur_time = (new Date()).toLocaleTimeString(); // ------------ Added by Solt
	var loc="http://"+d.location.hostname+d.location.pathname; // ------------ Added by Solt
	var tables = d.getElementsByTagName('TABLE');
if (this['debugger'])
	debugger;
	if(!top.ChatSys && ('DungMap' in d.all) && (this.sysMode==2 || this.sysMode==1 && tables[1].rows.length>1))
		top.bottom.sw_sys(); //--------------- Включаем системки
		
	if( (Red_str=doc_inner.match(/red>(.*?)<BR>/)) && this.sys_msg ){ // ------- вывод системки (на что кликнули и каков результат) ------- Added by Solt
		this.addSys(this.sys_msg + '<i>'+Red_str[1]+'<i>');
		this.sys_msg='';
	}

	if (tables.length<2 || tables[0].cells.length<2 
		|| tables[0].cells[1].getElementsByTagName('A').length!=1 
		|| tables[0].cells[1].getElementsByTagName('A')[0].href.search(/\?out=/)<0)
	{
					return;
	}

	var redText = tables[0].cells[0].innerText;
	if (redText.search('У вас слишком много таких объектов')>=0) {
		this.skip_quest = true;
		this.skip_mat_click = true;
		setTimeout(top.combats_plugins_manager.get_binded_method(
			this,
			function(){
				this.skip_mat_click = false;
			}),0);
	} else if (redText.search('Не хватает места')>=0) {
		this.skip_quest = true;
		this.skip_mat_click = true;
		if (this.enableNoPlaceAlert)
			setTimeout(top.combats_plugins_manager.get_binded_method(
				this,
				function(){
					alert('Наведите порядок в рюкзаке');
					this.skip_mat_click = false;
					this.skip_quest = false;
				}),0);
	} else if (redText.search('если за 5 минут его не подберут, он может стать вашим...')>=0) {
		this.skip_mat_click = true;
		setTimeout(top.combats_plugins_manager.get_binded_method(
			this,
			function(){
				this.skip_mat_click = false;
			}),0);
	} else if (redText=='У вас нет при себе необходимого предмета') {
		this.Direction=0;
	}

// ---------- try drop ----------
	var links = d.getElementsByTagName('A');
	for(i=0;i<links.length;i++) {
		link=links(i);
		var img = link.children[0];
		var match;
		if (link.href.search(/dungeon\d*\.pl\?get=/)>=0) {
			if (this.mat_click && !this.skip_mat_click 
				|| (!this.skip_mat_click && img.src.search(/mater\d\d\d\.gif/)>=0 && !this.skip_quest)
				|| (!this.skip_mat_click && (match = img.alt.match(/'(.*?)'/)) && (match[1] in this.alwaysItems)))
			{
				if (!(img.alt.replace(/^.*?'(.*)'.*?$/,'$1') in this.excludedItems) && !link.href.match(/#$/)) {
					top.combats_plugins_manager.getMainFrame().location = link.href+'&rnd='+Math.random();
					return;
				}
			}
		} else if (link.href=='' && link.onclick!=null && img!=null && img.nodeName=='IMG' && this.mat_abandon_contest) {
			match = link.outerHTML.match(/'rollconfirm\(".*?",".*?","(.*?)"\)'/);
			if (!this.usedObjects[match[1]]) {
				link.click();
				this.usedObjects[match[1]]=true;
//				d.forms['slform'].submit();
				d.forms['slform'].elements['pass'].click();
				return;
			}
		}
	}
//---------- Создание пустого радара 		
	var tab='<table border=0 cellspacing=7 cellpadding=0 id="Radar_table" style="table-layout: fixed;line-height:7px;font-size:7px">';
	for (var i=0; i<7; i++){
		tab+='<tr>';
		for (var j=0; j<7; j++)
			tab+='<td style="width: 7px; height: 7px; cursor: default">&nbsp;</td>';
		tab+='</tr>';
	}
	tab+='</table>';
	t= d.createElement('<DIV id="Radar" style="position:absolute; left:-2px; top:12px; width:120px; height:120px; filter: Alpha(Opacity=40);"></DIV>');
    d.getElementById('DungMap').insertBefore(t,null);
//	l_m=d.all.DungMap.getElementsByTagName('button')[d.all.DungMap.getElementsByTagName('img').length-1];
//	l_m.parentNode.insertBefore(t,l_m.nextSibling);
	d.all.Radar.innerHTML=tab;
	R_div=t;
	R_t=d.getElementById('Radar_table');
		
//---------- Обработка объектов (автокликанье, автонападение, прорисовка радара)
	arrLayers=top.combats_plugins_manager.getMainFrame().arrLayers; //----- Зарываемся в массив объектов+юнитов
	for(var y in arrLayers)
		for(var x in arrLayers[y])
			for(var rl in arrLayers[y][x]) {
				var Obj_X=parseInt(rl=='r'? x:-x);
				var Obj_Y=parseFloat(y);
				var tmp;
				if(top.combats_plugins_manager.getMainFrame().nMyDirection & 2){ //если направление 3 или 7, поворачиваем координаты направо
		tmp=Obj_X;
		Obj_X=Obj_Y;
		Obj_Y=-tmp;
				}
				if(top.combats_plugins_manager.getMainFrame().nMyDirection & 4){ //если 5 или 7, координаты разворачиваем на 180гр
		Obj_X=-Obj_X;
		Obj_Y=-Obj_Y;
				}
				var cell = R_t.rows[-Obj_Y+3].cells[Obj_X+3];
				var cell_priority = -1;
				for(var o in arrLayers[y][x][rl])
		for(var i in arrLayers[y][x][rl][o]) {
			var Obj=arrLayers[y][x][rl][o][i];
/*
			ssss = '';
			for(var jo in Obj) {
				ssss += '('+jo+':'+Obj[jo]+'),';
			}
*/
			var Obj_priority = 0;
			var style = {};
			var title = '';
			if (Obj.image in this.bots) {
				var match = Obj.id.match(/-(\d+)$/);
				if (('ids' in this.bots[Obj.image]) && match && (match[1] in this.bots[Obj.image].ids)) {
					Obj_priority = this.bots[Obj.image].ids[match[1]].priority || this.bots[Obj.image].priority || 2;
					style = this.bots[Obj.image].ids[match[1]].style || this.bots[Obj.image].style || { backgroundColor: 'red' };
					title = this.bots[Obj.image].ids[match[1]].title || '';
				} else {
					Obj_priority = this.bots[Obj.image].priority || 2;
					style = this.bots[Obj.image].style || { backgroundColor: 'red' };
					title = this.bots[Obj.image].title || '';
				}
			} else {
				if (o=='arrObjects' || Obj.HP) {
					Obj_priority = 0;
					style = { backgroundColor: 'green' };
				} else {
					Obj_priority = 1;
					style = { backgroundColor: 'red' };
				}
			}
			if(cell_priority < Obj_priority) {
				cell_priority = Obj_priority;
				for(var j in style)
					cell.style[j] = style[j];
			}
			if(cell.title!="")
				cell.title+="\n";
			cell.title+=Obj.name + title;

			if((x==0 && y==1) || (y==0 && x==1)) { //---------------- если спереди или с боков, кликаем.
				if( o=='arrObjects' && !(Obj.id in this.usedObjects) && (this.alwaysItems[Obj.name] || this.en_click && this.excludedObjects.indexOf(Obj.name)==-1)) { //-------Кликать на объекты
					this.usedObjects[Obj.id]=true;
					if(top.ChatSys) //------------ Добавить к логу на что кликали (если включены системки)
			this.sys_msg='<font class=date2>'+cur_time+'</font> Кликнули объект <b>'+Obj.name+'</b>, ';
					top.combats_plugins_manager.getMainFrame().location=loc+"?useobj="+Obj.id;
					return;
				} else if(this.autoAttack && (doc_inner.search(/DIV(.{2,18})LeftFront0_0/i)<0)) {//-- Нападать если нет стены
					if(Obj.action && Obj.action.search(/attack/)>=0) {
			if( (100*top.tkHP/top.maxHP)>this.minHP && (!top.maxMana || (100*top.tkMana/top.maxMana)>this.minMana) ) {
				top.combats_plugins_manager.getMainFrame().location=loc+"?attack=1&use="+Obj.id;
				return;
			} else {
				var timeout_HP = 180000*(top.maxHP*this.minHP/100-top.tkHP)/(top.speed*top.maxHP)*1000;
				var timeout_Mana = ((top.maxMana||0)>100)?180000*(top.maxMana*this.minMana/100-top.tkMana)/(top.mspeed*top.maxMana)*1000:0;
				var timeout = Math.max(timeout_HP, timeout_Mana);
				//setTimeout("top.combats_plugins_manager.getMainFrame().location.reload()",180000*(top.maxHP-top.tkHP)/(top.speed*top.maxHP)*1000);//обновить когда будет 100% HP
				setTimeout("top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.href",180000*(top.maxHP*this.minHP/100-top.tkHP)/(top.speed*top.maxHP)*1000+10000);//обновить когда будет minHP HP
			}
					}
				}
			}
		}
			}
	

if (0) {
	tables[0].rows(1).cells(0).innerHTML += '<table><tr><td><table>\
<tr><td><td><img id="i1" src="http://img.combats.com/i/move/navigatin_52.gif" style="cursor:pointer"><td>\
<tr><td><img id="i7" src="http://img.combats.com/i/move/navigatin_59.gif" style="cursor:pointer" onclick="this.setDirection(7)"><td id="td_stop" style="background-color:black;"><td><img id="i3" src="http://img.combats.com/i/move/navigatin_62.gif" style="cursor:pointer" onclick="this.setDirection(3)">\
<tr><td><td><img id="i5" src="http://img.combats.com/i/move/navigatin_67.gif" style="cursor:pointer" onclick="this.setDirection(5)"><td></table>\
<td>\
<input type="checkbox" id="en_click"'+(this.en_click?' CHECKED':'')+'>&nbsp;Кликать по объектам<br>\
<input type="checkbox" id="mat_click" onclick="this.mat_click=this.checked"'+(this.mat_click?' CHECKED':'')+'>&nbsp;Собирать ингридиенты<br>\
<input type="checkbox" id="autoPilot" onclick="if(this.autoPilot=this.checked);/*document.all.ignoreWall.checked=this.ignoreWall=false*/"'+(this.autoPilot?' CHECKED':'')+'>&nbsp;Автонавигация<br>\
<input type="checkbox" id="autoAttack" onclick="this.autoAttack=this.checked;"'+(this.autoAttack?' CHECKED':'')+'>&nbsp;Автонападение<br>\
<input type="checkbox" id="showMap" onclick="this.showMap=this.checked;"'+(this.showMap?' CHECKED':'') /*+' DISABLED=1'*/ +'>&nbsp;Показать карту<br>\
</table>';
}
	maxT=1800/top.speed*100;
	T=Math.floor(maxT/top.maxHP*100);
		
	//alert(dT+' '+T);
	d.getElementsByTagName('table')[2].rows[0].cells[0].innerHTML+="(100HP/"+T+"сек.)"
	//this.addSys(t);
/*
//---------Вычисление своих координат
	if(arrMap=top.combats_plugins_manager.getMainFrame().arrMap){
		map_i=parseInt(0); 
		for(y=0;y<8;y++){
			for(x=0;x<8;x++){
				map_i*=2;
				map_i+=(arrMap[y][x] ? 1:0);
			}
		}
		//this.addSys(map_i.toString(10));
		if(this.Coordinates[map_i])
			d.getElementsByTagName('table')[4].rows[0].cells[0].innerHTML+="<br>"+"x:"+this.Coordinates[map_i].x+" y:"+this.Coordinates[map_i].y;
	}
*/			

if (0) {
				for (var i=1; i<8; i+=2)
					d.all['i'+i].onclick = top.combats_plugins_manager.get_binded_method(this,this.setDirection, i);

				d.all['td_stop'].onclick = top.combats_plugins_manager.get_binded_method(this,this.stop_it);
				d.all['en_click'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
				d.all['mat_click'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
				d.all['autoPilot'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
				d.all['autoAttack'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
				d.all['showMap'].onclick = top.combats_plugins_manager.get_binded_method(this,this.doShowMap);
		
				if (this.Direction) {
					img=d.all("i"+this.Direction);
					img.src=img.src.replace(/\.gif$/,"b.gif");
				} else
					d.all("td_stop").style.backgroundColor="red";
}

				this.doShowMap();

				combats_plugins_manager.fireEvent('dungeon_walk.step',null);
				if (this.destination)
					this.makeStep();
				else if (this.autoPilot) {
					if (this.Direction && !d.getElementById("m"+this.Direction)) {
						if (d.getElementById("m1")) {
							this.setDirection(1);
						} else {
							el = d.getElementById("m"+((this.Direction+6)%8));
							er = d.getElementById("m"+((this.Direction+2)%8));
							if (er && !el)
								setTimeout("top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+'?rnd="+Math.random()+"&path=rr';",100);
							else if (el && !er)
								setTimeout("top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+'?rnd="+Math.random()+"&path=rl';",100);
							return;
						}
					}
					var mtime = top.combats_plugins_manager.getMainFrame().mtime*(1-(top.combats_plugins_manager.getMainFrame().progressAt/top.combats_plugins_manager.getMainFrame().progressEnd));
					if (mtime<0)
						mtime = 0;
					if (this.forcedStepTime && mtime>this.forcedStepTime)
						mtime = this.forcedStepTime;
					if(!this.forced || this.steptimer==null || mtime==0) {
						if (d.getElementById("m"+this.Direction) && (this.Direction!=1 || !("l2op1" in d.all) || d.all["l2op1"].childNodes.length>1 )){
							this.StartStepTimer(this.do_step, mtime);
			}
					}
				}

				d.parentWindow.attachEvent("onbeforeunload",top.combats_plugins_manager.get_binded_method(this,this.onunloadHandler));
			} catch (e) {
				e.Function = 'onLoadHandler';
				combats_plugins_manager.logError(this,e);
			}
		},

		getMapPosition: function(Map, arrMap) {
			// this.addLog('getMapPosition');
			function search_map_row(start_row) {
				start_row = start_row || 0;
				var found = false;
				var s = arrMap[0].join(',');
				for(var j=start_row; j<Map.length-arrMap.length+1; j++) {
					var ss = Map[j].join(',');
					if (ss.indexOf(s)>=0) {
						found = true;
						for(var i=1; i<arrMap.length; i++) {
							var sss = arrMap[i].join(',');
							ss = Map[j+i].join(',');
							if (ss.indexOf(sss)<0) {
								found = false;
								break;
							}
						}
						if (found) {
							return j;
						}
					}
				}
				if (!found)
					return -1;
			}

			var map_x;
			var map_y = search_map_row();

			while (map_y>=0) {
				for (var jj=0; jj<Map[0].length-arrMap[0].length+1; jj++) {
					var found = true;
					for(var i=0; found && i<arrMap.length; i++) {
						for(var j=0; j<arrMap[0].length; j++) {
							if (Map[map_y+i][jj+j]!=arrMap[i][j]) {
								found = false;
								break;
							}
						}
					}
					if (found) {
						map_x = jj;
						break;
					}
				}
				if (found) {
					// this.addLog(''+(map_x+4)+', '+(map_y+4));
					return {x:map_x+4, y:map_y+4};
				}
				map_y = search_map_row(map_y+1);
			}
			// this.addLog('?, ?');
			return null;
		},

		"getCurrentFloor": function() {
			// this.addLog('getCurrentFloor');
			try {
				if (this.Map) {
					var location = top.combats_plugins_manager.getMainFrame().document.getElementsByTagName('table')[0].cells[1].innerHTML.replace(/&nbsp;.*/,'');
					if (this.locationCache[location])
						return this.locationCache[location];
					var match = location.split(/\s*-\s*/);
					for(var i=0,l=match.length;i<l;i++){
						if(this.Map[match.slice(0,l-i).join('-')]){
							this.locationCache[location]=match.slice(0,l-i).join('-')
							return this.locationCache[location];
						}
					}
				}
			} catch(e) {
			}
			return '';
		},

		"updateMap": function(enforce) {
			this.dungeonName = top.frames['activeusers'].document.getElementById('room').innerText.replace(/\s*\(\d+\)$/,'');
			if (!this.dungeonName)
				this.dungeonName = this.defaultDungeonName;
			var mapFileName = 'walk\\'+this.cityName+'-'+this.dungeonName+'.js';
			this.addLog('Грузим: '+mapFileName);
			if (enforce || this.mapFileName!=mapFileName) {
				this.addLog('loading map file');
				var s = external.readFile(
					top.combats_plugins_manager.security_id,
					"Combats.RU",
					mapFileName) || '';
				if (!s) {
					mapFileName = 'walk\\'+this.dungeonName+'.js';
					this.addLog('Грузим: '+mapFileName);
					var s = external.readFile(
						top.combats_plugins_manager.security_id,
						"Combats.RU",
						mapFileName) || '';
				}
				if (s) {
					this.Map = eval('(function(){ return '+s+' })()');
					this.availableCells = {}
					this.objects = {};
					for(var floor in this.Map) {
						this.availableCells[floor] = [];
						this.objects[floor] = [];
						for(var i in this.Map[floor]) {
							this.availableCells[floor][i] = [];
							this.objects[floor][i] = [];
							for(var j in this.Map[floor][i]) {
								if (this.Map[floor][i][j].constructor === Array) {
									this.availableCells[floor][i][j] = this.Map[floor][i][j][0];
									for(var obj in this.Map[floor][i][j])
										if (this.Map[floor][i][j][obj]==='') {
											this.availableCells[floor][i][j] = '';
											this.Map[floor][i][j].splice(obj,1);
											break;
										}
									if (this.Map[floor][i][j].length>1)
										this.objects[floor][i][j] = this.Map[floor][i][j].slice(1).join('\n');
									this.Map[floor][i][j] = this.Map[floor][i][j][0];
								} else {
									this.availableCells[floor][i][j] = this.Map[floor][i][j];
									this.objects[floor][i][j] = '';
								}
							}
						}
					}
					this.mapFileName = mapFileName;
				} else {
					this.Map = null;
				}
			}
		},

		"doShowMap": function() {
			this.addLog('doShowMap');
			if (this.mapTargetMenu)
				this.mapTargetMenu.style.display = 'none';
/*
			var b = top.combats_plugins_manager.getMainFrame().document.getElementById('showMap');
*/
			if (this.showMap/* || !b || b.checked*/) {
				this.setCurrentSettings();
				if (!this.mapPanel) {
					// this.addLog('creating panel');
					this.mapPanel = combats_plugins_manager.createWindow('Карта', 480, 360, combats_plugins_manager.get_binded_method(this,this.doHideMap,true));
					var div = top.document.createElement('<div style="width:100%; height:100%; overflow: scroll;">');
					this.div = top.document.createElement('<div style="position: relative">');
					div.insertBefore( this.div, null );
					oPanel.oWindow.Insert( div );
				}

				if (!this.Map) {
					this.updateMap(true);
				}
				var floor = this.getCurrentFloor();
				this.addLog('floor: '+floor);
				var Map = this.Map ? this.Map[floor] : null;
				var availableCells = this.availableCells ? this.availableCells[floor] : null;
				var objects = this.objects ? this.objects[floor] : null;
				if (!Map) {
					this.updateMap(true);
					if (!this.Map) this.addLog('no map');
					floor = this.getCurrentFloor();
					Map = this.Map ? this.Map[floor] : null;
					availableCells = this.availableCells ? this.availableCells[floor] : null;
					objects = this.objects ? this.objects[floor] : null;
				}
				while (this.div.firstChild)
					this.div.removeChild(this.div.firstChild);
				if (Map) {
					this.addLog('floor found');
					this.div.style.width = ''+((Map[0].length-8)*15)+'px';
					this.div.style.height = ''+((Map.length-8)*15)+'px';
					var selectMapTarget = combats_plugins_manager.get_binded_method(this,this.selectMapTarget);
					for(var i=4; i<Map.length-4; i++)
						for(var j=4; j<Map[i].length-4; j++) {
							if (Map[i][j]) {
								var cell = top.document.createElement('<div style="position: absolute; width:17px; height:17px; background: url(http://img.combats.com/i/sprites/map/'+Map[i][j]+'.gif) no-repeat center center; overflow: hidden; left:'+(j*15-60)+'px; top:'+(i*15-60)+'px">');
								this.div.insertBefore(cell, null);
								if (availableCells[i][j]) {
									cell.onclick = selectMapTarget;
									cell.mapX = j;
									cell.mapY = i;
									if (objects[i][j]) {
										cell.innerHTML = '<img src="'+this.markUseful+'" alt="'+objects[i][j]+'" style="position:absolute; left:2px; top:2px;"/>';
									}
								} else {
									if (objects[i][j]) {
										cell.innerHTML = '<img src="'+this.markUseful+'" alt="'+objects[i][j]+'" style="position:absolute; left:2px; top:2px;"/>';
									} else {
										cell.innerHTML = '<img src="'+this.markObstacle+'" alt="Препятствие" style="position:absolute; left:2px; top:2px;"/>';
									}
								}
							}
						}
					var arrMap = top.combats_plugins_manager.getMainFrame().arrMap;
					for (var i in arrMap)
						for (var j in arrMap[i])
							if (arrMap[i][j].constructor == top.combats_plugins_manager.getMainFrame().Array)
								arrMap[i][j] = arrMap[i][j][0];
					this.position = this.getMapPosition(Map, arrMap);
					if (this.position) {
						var cell = top.document.createElement('<div style="position: absolute; width:7px; height:7px; background: url(http://img.combats.com/i/move/p1/d0.gif) no-repeat center center; left:'+(this.position.x*15-55)+'px; top:'+(this.position.y*15-59)+'px" title="Текущее местонаходение">');
						this.div.insertBefore(cell, null);
					}
					if (this.destination) {
						// this.addLog('destination: '+this.destination.x+','+this.destination.y);
						this.displayDestinationPointer(this.destination);
					}
				} else {
					this.div.innerHTML = '<i>Нет данных по "'+this.dungeonName+'", "'+floor+'"</i>';
				}
				this.mapPanel.oWindow.Show();
			} else {
				this.doHideMap(true);
			}
		},

		"doHideMap": function(permanent) {
			// this.addLog('doHideMap');
			if (this.mapPanel)
				this.mapPanel.oWindow.Hide();
			if (permanent) {
				this.showMap = false;
				var input = top.combats_plugins_manager.getMainFrame().document.all['showMap'];
				if (input) {
					input.checked = false;
					this.setCurrentSettings();
				}
			}
			if (this.mapTargetMenu)
				this.mapTargetMenu.style.display = 'none';
		},

		"displayDestinationPointer": function(position) {
			// this.addLog('displayDestinationPointer');
			if (!this.pointer)
				this.pointer = top.document.createElement('<div style="position: absolute; width:9px; height:13px; background: url(file:///'+combats_plugins_manager.base_folder+'/walk/arrow.gif) no-repeat; line-height: 1px">');
			this.pointer.style.left = ''+(position.x*15-56)+'px';
			this.pointer.style.top = ''+(position.y*15-55)+'px';
			this.pointer.style.display = '';
			this.div.insertBefore(this.pointer, null);
		},

		"selectMapTarget": function(e) {
			// this.addLog('selectMapTarget');
			e = e || window.event;
			this.selectedPosition = {x:e.srcElement.mapX, y:e.srcElement.mapY, floor:this.getCurrentFloor()};
			var x = e.srcElement.offsetLeft+5;
			var y = e.srcElement.offsetTop+5;
			this.displayDestinationPointer(this.selectedPosition);

			if (!this.mapTargetMenu)
				this.mapTargetMenu = top.document.createElement('<div style="position: absolute; background: #FFF0FF; margin: 5px 5px; cursor:pointer;">');
			this.mapTargetMenu.style.left = ''+(e.clientX+10)+'px'; 
			this.mapTargetMenu.style.top = ''+(e.clientY+10)+'px'; 

			while (this.mapTargetMenu.firstChild)
				this.mapTargetMenu.removeChild(this.mapTargetMenu.firstChild);
			var item = top.document.createElement('div');
			item.innerText = 'Бежать сюда';
			item.onclick = combats_plugins_manager.get_binded_method(this,function(){
				this.mapTargetMenu.style.display = 'none';
				this.runToPont(this.selectedPosition);
			});
			this.mapTargetMenu.insertBefore(item, null);
			top.document.body.insertBefore(this.mapTargetMenu, null);
			this.mapTargetMenu.style.display = '';
		},
		
		"runToPont": function(position) {
			// this.addLog('runToPont');
			if (!this.availableCells[position.floor][position.y][position.x])
				return;
			this.oneStepMode = false;
			this.Direction=0;
			this.destination = position;
			this.makeStep();
		},

		isPointOnTheWay: function(startPoint, stopPoint, checkPoint) {
			// this.addLog('isPointOnTheWay');
			var floor = this.getCurrentFloor();
			var Map = this.Map ? this.Map[floor] : null;
			if (!Map)
				return null;

			var wave = this.prepareWave(Map, stopPoint);
			
			var startPointX = startPoint.x;
			var startPointY = startPoint.y;
			try {
				var currLen = this.runWave(wave, Map, startPointX, startPointY);
				if (!currLen)
					return null;

				// this.addLog('path found');
				var stopPointX = stopPoint.x;
				var stopPointY = stopPoint.y;
				var checkPointX = checkPoint.x;
				var checkPointY = checkPoint.y;
				while(currLen>0) {
					if (startPointY==checkPointY && startPointX==checkPointX)
						return true;
					var cell = Map[startPointY][startPointX];
					if (cell.indexOf('1')<0 && wave[startPointY-1][startPointX]==currLen) {
						startPointY -= 1;
					} else if (cell.indexOf('3')<0 && wave[startPointY][startPointX+1]==currLen) {
						startPointX += 1;
					} else if (cell.indexOf('5')<0 && wave[startPointY+1][startPointX]==currLen) {
						startPointY += 1;
					} else if (cell.indexOf('7')<0 && wave[startPointY][startPointX-1]==currLen) {
						startPointX -= 1;
					}
					currLen--;
				}
				return false;
			} catch(e) {
				// this.addLog('exception');
			}
		},

		prepareWave: function(Map, stopPoint) {
			// this.addLog('floor found');
			var wave = [];
			for(var i in Map) {
				wave[i] = [];
				for(var j in Map[i])
					wave[i][j] = 0;
			}
			wave[stopPoint.y][stopPoint.x] = 1; // стартовая точка
			return wave;
		},

		"runWave": function(wave, Map, startPointX, startPointY) {
			var currLen = 1;
			var waveIsOk = true;
			while(waveIsOk) {
				waveIsOk = false;
				for(var ii in Map) {
					i = parseInt(ii)
					for(var jj in Map[i]) {
						j = parseInt(jj)
						if (!wave[i][j] && Map[i][j]) {
							if (Map[i][j].indexOf('1')<0 && wave[i-1][j]==currLen)
								wave[i][j]=currLen+1;
							if (Map[i][j].indexOf('3')<0 && wave[i][j+1]==currLen)
								wave[i][j]=currLen+1;
							if (Map[i][j].indexOf('5')<0 && wave[i+1][j]==currLen)
								wave[i][j]=currLen+1;
							if (Map[i][j].indexOf('7')<0 && wave[i][j-1]==currLen)
								wave[i][j]=currLen+1;

							if (wave[i][j]==currLen+1) {
								waveIsOk = true;
								if (i==startPointY && j==startPointX) {
									return currLen;
								}
							}
						}
					}
				}
				currLen++;
			}
			return null;
		},
		
		"createPath": function(startPoint, stopPoint) {
			// this.addLog('createPath');
			var floor = this.getCurrentFloor();
			var Map = this.availableCells ? this.availableCells[floor] : null;
			if (!Map)
				return null;

			var wave = this.prepareWave(Map, stopPoint);
			
			var startPointX = startPoint.x;
			var startPointY = startPoint.y;
			try {
				var currLen = this.runWave(wave, Map, startPointX, startPointY);
				if (!currLen)
					return null;

				// this.addLog('path found');
				var cell = Map[startPointY][startPointX];
				if (cell.indexOf('1')<0 && wave[startPointY-1][startPointX]==currLen) {
					return {x:startPointX,y:startPointY-1,d:1};
				} else if (cell.indexOf('3')<0 && wave[startPointY][startPointX+1]==currLen) {
					return {x:startPointX+1,y:startPointY,d:3};
				} else if (cell.indexOf('5')<0 && wave[startPointY+1][startPointX]==currLen) {
					return {x:startPointX,y:startPointY+1,d:5};
				} else if (cell.indexOf('7')<0 && wave[startPointY][startPointX-1]==currLen) {
					return {x:startPointX-1,y:startPointY,d:7};
				}
			} catch (e) {
				// this.addLog('exception');
			}
		},
		
		"checkDirection": function(d) {
			// this.addLog('check direction');
			var match = top.combats_plugins_manager.getMainFrame().document.body.innerHTML.match(/>смотрим на (север|юг|запад|восток)<\//i);
			if (match) {
				// this.addLog('direction found');
				var direction = {'север':1,'восток':3,'юг':5,'запад':7}[match[1]];
				if (direction==d)
					return true;

				var stepObj = { enable: true };
				combats_plugins_manager.fireEvent('dungeon_walk.before_step', stepObj);
				if (stepObj.enable) {
					var turn_id;
					if (direction==1 && d==3 || direction==3 && d==5 || direction==5 && d==7 || direction==7 && d==1)
						turn_id='rr';// turn right
					else
						turn_id='rl';// turn left

					this.StartStepTimer(function(){
						// this.addLog('rotate');
						top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+'?rnd='+Math.random()+'&path='+turn_id;
					},0.1);
				} else {
					this.addSys('Нельзя шагать: это кому-то мешает');
					this.StartStepTimer(function(){
						top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+'?rnd='+Math.random();
					}, 2);
				}
				return false;
			}
		},

		"stopAll": function(position) {
			position = position || (top.combats_plugins_manager.getMainFrame().arrMap ? this.getMapPosition(this.Map, top.combats_plugins_manager.getMainFrame().arrMap) : null);
			this.stop_it();
			this.oneStepMode = false;
			this.nextPosition = null;
			this.prevPosition = null;
			this.destination = null;
			combats_plugins_manager.fireEvent('dungeon_walk.finish', {position:position});
		},

		"checkEnemy": function() {
			try {
				if (!top.combats_plugins_manager.getMainFrame().arrLayers[1] || !top.combats_plugins_manager.getMainFrame().arrLayers[1][0])
					return true;
				var units = top.combats_plugins_manager.getMainFrame().arrLayers[1][0].l.arrUnits;
				for(var i in units) {
					// если есть хотя бы один противник, ждём 10 секунд и обновляем
					if (!units[i].maxHP) {
						// this.addLog('enemy');
						combats_plugins_manager.fireEvent('dungeon_walk.enemy', {units:units});
						this.StartStepTimer(function(){
							top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+'?rnd='+Math.random();
						}, this.randomWaitTimeMin+Math.random()*this.randomWaitTimeMax);
						return false;
					}
				}
			} catch(e) {
			}
			return true;
		},

		"startOneStepForward": function(startPosition, finishPosition) {
			this.oneStepMode = true;
			this.prevPosition = { x:startPosition.x, y:startPosition.y };
			this.nextPosition = { x:finishPosition.x, y:finishPosition.y };
			this.doStep();
		},

		"doStep": function() {
			// this.addLog('doStep');
			var mtime = top.combats_plugins_manager.getMainFrame().mtime*(1-(top.combats_plugins_manager.getMainFrame().progressAt/top.combats_plugins_manager.getMainFrame().progressEnd));
			if (this.forcedStepTime && mtime>this.forcedStepTime)
				mtime = this.forcedStepTime;
			if (this.checkEnemy()) {
				if (top.tkHP<this.minSafeHP) {
					this.addSys('Нельзя шагать: низкий уровень HP');
					this.StartStepTimer(function(){
						top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+'?rnd='+Math.random();
					}, this.randomWaitTimeMin+Math.random()*this.randomWaitTimeMax);
				} else {
					var stepObj = { enable: true };
					combats_plugins_manager.fireEvent('dungeon_walk.before_step', stepObj);
					if (stepObj.enable) {
						this.StartStepTimer(function(){
							try {
								this.checkEnemy();
							} catch(e) {
							}
							// this.addLog('step forward');
							top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+'?rnd='+Math.random()+'&path=m1';
						},mtime+0.1);
					} else {
						this.addSys('Нельзя шагать: это кому-то мешает');
						this.StartStepTimer(function(){
							top.combats_plugins_manager.getMainFrame().location=top.combats_plugins_manager.getMainFrame().location.pathname+'?rnd='+Math.random();
						}, this.randomWaitTimeMin+Math.random()*this.randomWaitTimeMax);
					}
				}
			}
		},
		
		"makeStep": function() {
			// this.addLog('makeStep');
			var floor = this.getCurrentFloor();
			var Map = this.Map ? this.Map[floor] : null;
			if (Map) {
				var arrMap = top.combats_plugins_manager.getMainFrame().arrMap;
				for (var i in arrMap)
					for (var j in arrMap[i])
						if (arrMap[i][j].constructor == top.combats_plugins_manager.getMainFrame().Array)
							arrMap[i][j] = arrMap[i][j][0];
				this.position = this.getMapPosition(Map, arrMap);
				if (this.position) 
				{
					if (floor==this.destination.floor && this.position.x==this.destination.x && this.position.y==this.destination.y) {
						if (this.oneStepMode || !this.destination.d || this.checkDirection(this.destination.d)) {
							this.stopAll(this.position);
						}
					} else if (floor==this.destination.floor
						&& ((!this.prevPosition || (this.position.x==this.prevPosition.x && this.position.y==this.prevPosition.y))
							|| (!this.nextPosition || (this.position.x==this.nextPosition.x && this.position.y==this.nextPosition.y)))) 
					{
						// шаг не удался, надо ещё раз попробовать
						// или шаг удался, шагаем дальше
						if (this.oneStepMode) {
							this.doStep();
						} else {
							var path = this.createPath({ x:this.position.x, y:this.position.y }, { x:this.destination.x, y:this.destination.y });
							if (path) {
								if (this.checkDirection(path.d)) {
									this.prevPosition = { x:this.position.x, y:this.position.y };
									this.nextPosition = { x:path.x, y:path.y };
									this.doStep();
								}
							} else {
								// this.addLog('cannot create path');
								this.nextPosition = null;
								this.prevPosition = null;
								this.destination = null;
								combats_plugins_manager.fireEvent('dungeon_walk.finish', { position:this.position });
							}
						}
					} else {
						// шаг удался, но оказались в неожиданном месте
						this.nextPosition = null;
						this.prevPosition = null;
						this.destination = null;
						combats_plugins_manager.fireEvent('dungeon_walk.finish', { position:null });
					}
				} else {
					// this.addLog('position is unknown');
					this.nextPosition = null;
					this.prevPosition = null;
					this.destination = null;
					combats_plugins_manager.fireEvent('dungeon_walk.finish', {position:this.position});
				}
			}
		},

		'createButton': function() {
			this.button = top.combats_plugins_manager.plugins_list['top_tray'].addButton({
				'button': {
					'style': {
						'width': "30px",
						'height': "20px",
						'padding': "2px",
						'background': "#505050",
						'overflow':'hidden'
					},
					'onclick': top.combats_plugins_manager.get_binded_method(this,function(){
						this.showMap = !this.showMap;
						this.doShowMap();
					})
				},
				'img': {
					'style': {
						'width': "20px",
						'height': "20px",
						'margin': '-2px 3px'
					},
					'onmouseout': function() {
						this.src = "file:///"+combats_plugins_manager.base_folder+"walk/map.png";
					},
					'onmouseover': function() {
						this.src = "file:///"+combats_plugins_manager.base_folder+"walk/map_hover.png";
					},
					'src': "file:///"+combats_plugins_manager.base_folder+"walk/map.png",
					'alt': "Карта подземелья"
				}
			});
		},

		"Init": function() {
			this.Direction = 0;
			this.en_click=false;
			this.mat_click=false;
			this.ignoreWall=false;
			this.autoPilot=true;
			this.autoAttack=false;
			this.showMap=false;
			this.steptimer=null;
			this.forced=false;
			this.showUnits=true;
			this.showObjects=true;
			this.minHP = 95;
			this.minMana = 95;
			this.excludedObjects='';
			this.skip_quest=false;
			this.usedObjects=new Object();
			this.sys_msg = '';
			this.cityName = top.combats_plugins_manager.cityName;

			this.clearLog();

			top.combats_plugins_manager.attachEvent(
				'mainframe.load',
				top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
			this.clearUsedObjects();
			this.createButton();

			this.forced=(this.load('forced','no')=='yes');
			this.ignoreWall=(this.load('ignoreWall','no')=='yes');
			this.showUnits=(this.load('showUnits','yes')=='yes');
			this.showObjects=(this.load('showObjects','yes')=='yes');
			this.autoHideMap = (this.load('autoHideMap','yes')=='yes');
			this.minHP=parseFloat(this.load('minHP','95')) || 0;
			this.minMana=parseFloat(this.load('minMana','95')) || 0;
			this.excludedObjects=this.load('exclude','').replace(/;/g, "\n");
			this.defaultDungeonName=this.load(this.cityName+'.defaultDungeonName','');
			var items=this.load('alwaysItems','Блеклый подземник;Черепичный подземник;Кровавый подземник').split(/;/);
			this.alwaysItems = {};
			for(var i=0; i<items.length; i++)
				this.alwaysItems[items[i]] = true;
			items=this.load('excludedItems','').split(/;/);
			this.excludedItems = {};
			for(var i=0; i<items.length; i++)
				this.excludedItems[items[i]] = true;
			this.forcedStepTime = parseFloat(this.load('forcedStepTime','0'));
			this.sysMode = parseInt(this.load('sysMode','2')) || 0;
			this.randomWaitTimeMin = parseInt(this.load('randomWaitTimeMin','10')) || 10;
			this.randomWaitTimeMax = parseInt(this.load('randomWaitTimeMax','0')) || 0;
			this.en_click = this.auto_en_click = this.load('auto_en_click','false')=='true';
			this.mat_click = this.auto_mat_click = this.load('auto_mat_click','false')=='true';
			this.mat_abandon_contest = this.load('mat_abandon_contest','false')=='true';
			this.enableNoPlaceAlert = this.load('enableNoPlaceAlert','true')!='false';
			this.minSafeHP = parseFloat(this.load('minSafeHP','0')) || 0;

			if( /walkSettings=(\d+)/.test( document.cookie ) ){
				t = parseFloat( document.cookie.match( /walkSettings=(\d+)/ )[ 1 ] );

				this.en_click=((t & 8)>0);
				this.mat_click=((t & 16)>0);
				this.ignoreWall=((t & 32)>0);
				this.autoPilot=((t & 64)>0);
				this.autoAttack=((t & 128)>0);

				this.Direction=(t & 7);
			}

			return this;
		}
	}.Init();
})()
