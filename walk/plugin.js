(function() {
  return {
    "toString": function() {
      return "Бродилка по пещере";
    },

    mapFileName: '',
    Map: null,
    excludedItems: {},

    "bots": {
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
          }
        }
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
      for(var i in this.excludedItems) {
        items.push(i);
      }
      return [
		{ name: "\"Опережающий\" таймер", value: this.forced },
                { name: "Игнорировать препятствия", value: this.ignoreWall },
		{ name: "Отображать монстров на радаре", value: this.showUnits },
		{ name: "Отображать объекты на радаре", value: this.showObjects },
		{ name: "Скрывать карту, если открыто не подземелье", value: this.autoHideMap },
		{ name: "Минимум HP для автонападения", value: this.minHP},
		{ name: "Минимум маны для автонападения", value: this.minMana},
		{ name: "Список исключенных <br>из автокликера объектов", value: this.excludedObjects, type:"textarea"},
		{ name: "Предметы, которые не нужно поднимать", value: items.join("\n"), type:"textarea"}
      ];
    },

    "setProperties": function(a) {
	this.forced=a[0].value;
	this.ignoreWall=a[1].value;
	this.showUnits=a[2].value;
	this.showObjects=a[3].value;
	this.autoHideMap=a[4].value;
	this.minHP=parseFloat(a[5].value) || 95;
	this.minMana=parseFloat(a[6].value) || 95;
	this.excludedObjects=a[7].value;
        this.excludedItems = {};
        var items = a[8].value.split(/\s*[\n\r;]+\s*/);
	for(var i=0; i<items.length; i++)
          this.excludedItems[items[i]] = true;

	this.save('forced',this.forced?"yes":"no");
	this.save('ignoreWall',this.ignoreWall?"yes":"no");
	this.save('showUnits',this.showUnits?"yes":"no");
	this.save('showObjects',this.showObjects?"yes":"no");
	this.save('autoHideMap',this.autoHideMap?"yes":"no");
	this.save('minHP',this.minHP.toString());
	this.save('minMana',this.minMana.toString());
	this.save('exclude',this.excludedObjects.replace(/\s*[\n\r]+\s*/g,";"));
	this.save('excludeItems',a[6].value.replace(/\s*[\n\r]+\s*/g,";"));
    },

    "setDirection": function(a) {
        if(this.Direction) {
          img=window.frames[3].document.all("i"+this.Direction);
          img.src=img.src.replace(/b\.gif$/,".gif");
        }
        this.Direction=a;
        img=top.frames[3].document.all("i"+this.Direction);
        img.src=img.src.replace(/b?\.gif$/,"b.gif");
        top.frames[3].document.all("td_stop").style.backgroundColor="black";
        if (this.ignoreWall || top.frames[3].document.getElementById("m"+this.Direction) && this.steptimer==null) {
          var mtime = top.frames[3].mtime*(1-(top.frames[3].progressAt/top.frames[3].progressEnd));
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
          img=window.frames[3].document.all("i"+this.Direction);
          img.src=img.src.replace(/b\.gif$/,".gif");
        }
        this.Direction=0;
        window.frames[3].document.all("td_stop").style.backgroundColor="red";
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
          if ((oLayer = top.frames[3].document.getElementById('1_0l')))
            oObjects = oLayer.getElementsByTagName('button');
            for (var i=0; i<oObjects.length; i++)
               if (oObjects[i].currentStyle.filter.search(/src=.?http\:\/\/img\.combats\.(?:com|ru)\/i\/chars\/d\//)>=0
                   && (oObjects[i].nextSibling==null || oObjects[i].nextSibling.className!='Life')) {
                 canStep = false;
                 break;
               }
        }

        if(this.Direction>0 && canStep) {
          top.frames[3].location=top.frames[3].location.pathname+"?rnd="+Math.random()+"&path=m"+this.Direction;
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
      this.usedObjects=new Object();
      setTimeout(top.combats_plugins_manager.get_binded_method(this,this.clearUsedObjects),60*60*1000);
      this.skip_quest = false;
    },

    "setCurrentSettings": function() {
        this.en_click=top.frames[3].document.all['en_click'].checked;
	this.mat_click=top.frames[3].document.all['mat_click'].checked;
//        this.ignoreWall=top.frames[3].document.all['ignoreWall'].checked;
        this.autoPilot=top.frames[3].document.all['autoPilot'].checked;
        this.autoAttack=top.frames[3].document.all['autoAttack'].checked;
        this.showMap=top.frames[3].document.all['showMap'].checked;
		
        t=this.Direction;
	t=this.en_click ? (t | 8):(t & 247);
	t=this.mat_click ? (t | 16):(t & 239);
	t=this.ignoreWall ? (t | 32):(t & 223);
	t=this.autoPilot ? (t | 64):(t & 191);
	t=this.autoAttack ? (t | 128):(t & 127);
		
	//alert(t.toString(2));
	document.cookie = "walkSettings=" + t + ";";
    },

    "onloadHandler": function() {
      try {
        var d=top.frames[3].document;
        if(d.location.pathname.search(/^\/dungeon\d*\.pl/)!=0) {
          if (this.autoHideMap)
            this.doHideMap();
          return;
        }
		var doc_inner=d.body.innerHTML.toString(); // ----------- Added by Solt
		var cur_time = (new Date()).toLocaleTimeString(); // ------------ Added by Solt
		var loc="http://"+d.location.hostname+d.location.pathname; // ------------ Added by Solt
        tables = d.getElementsByTagName('TABLE');
	    if(!top.ChatSys && ('DungMap' in d.all)) top.bottom.sw_sys(); //--------------- Включаем системки
		
		if( (Red_str=doc_inner.match(/red>(.*?)<BR>/)) && this.sys_msg ){ // ------- вывод системки (на что кликнули и каков результат) ------- Added by Solt
			top.Chat.am(this.sys_msg + '<i>'+Red_str[1]+'<i>');
			this.sys_msg='';
		}

        if (tables.length<2 || tables[0].cells.length<2 
          || tables[0].cells[1].getElementsByTagName('A').length!=1 
		  || tables[0].cells[1].getElementsByTagName('A')[0].href.search(/\?out=/)<0) {
          return;
		}

	var redText = tables[0].rows(1).cells(0).innerText;
        if (redText.search('У вас слишком много таких объектов')>=0) {
          this.skip_quest = true;
	  this.skip_mat_click = true;
          setTimeout(top.combats_plugins_manager.get_binded_method(
            this,
            function(){
	      this.skip_mat_click = false;
            }),0);
        } else
        if (redText.search('Не хватает места')>=0) {
          this.skip_quest = true;
	  this.skip_mat_click = true;
          setTimeout(top.combats_plugins_manager.get_binded_method(
            this,
            function(){
              alert('Наведите порядок в рюкзаке');
	      this.skip_mat_click = false;
              this.skip_quest = false;
            }),0);
        } else
        if (redText.search('если за 5 минут его не подберут, он может стать вашим...')>=0) {
	  this.skip_mat_click = true;
          setTimeout(top.combats_plugins_manager.get_binded_method(
            this,
            function(){
	      this.skip_mat_click = false;
            }),0);
        } else
        if (redText=='У вас нет при себе необходимого предмета') {
          this.Direction=0;
        }
		  
// ---------- try drop ----------
        for(i=0;i<d.links.length;i++) {
          link=d.links(i);
          if (link.href.search(/dungeon\d*\.pl\?get=/)>=0 && (this.mat_click && !this.skip_mat_click || (link.children[0].src.search(/mater\d\d\d\.gif/)>=0 && !this.skip_quest))) {
            if (!(link.children[0].alt.replace(/^.*?'(.*)'.*?$/,'$1') in this.excludedItems)) {
              top.frames[3].location = link.href;
              return;
            }
          }
        }
//---------- Создание пустого радара 		
	var tab='<table border=0 cellspacing=8 cellpadding=0 id="Radar_table" style="table-layout: fixed">';
	for (var i=0; i<7; i++){
		tab+='<tr>';
		for (var j=0; j<7; j++)
			tab+='<td style="width: 7px; height: 7px;"></td>';
		tab+='</tr>';
	}
	tab+='</table>';
	t= d.createElement('<DIV id="Radar" style="position: absolute; width: 120px; height: 120px; filter: Alpha(Opacity=40);"></DIV>');
	l_m=d.all.DungMap.getElementsByTagName('button')[d.all.DungMap.getElementsByTagName('button').length-1];
	l_m.parentNode.insertBefore(t,l_m.nextSibling);
	d.all.Radar.innerHTML=tab;
	R_div=d.getElementById('Radar');
	R_t=d.getElementById('Radar_table');
	R_div.style.left=5;
	R_div.style.top=8;
		
//---------- Обработка объектов (автокликанье, автонападение, прорисовка радара)
	arrLayers=top.frames[3].arrLayers; //----- Зарываемся в массив объектов+юнитов
	for(var y in arrLayers)
	  for(var x in arrLayers[y])
	    for(var rl in arrLayers[y][x]) {
	      var Obj_X=parseInt(rl=='r'? x:-x);
	      var Obj_Y=parseFloat(y);
	      var tmp;
	      if(top.frames[3].nMyDirection & 2){ //если направление 3 или 7, поворачиваем координаты направо
		tmp=Obj_X;
		Obj_X=Obj_Y;
		Obj_Y=-tmp;
	      }
	      if(top.frames[3].nMyDirection & 4){ //если 5 или 7, координаты разворачиваем на 180гр
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
		    if( o=='arrObjects' && !(Obj.id in this.usedObjects) && this.en_click && this.excludedObjects.indexOf(Obj.name)==-1) { //-------Кликать на объекты
		      this.usedObjects[Obj.id]=true;
		      if(top.ChatSys) //------------ Добавить к логу на что кликали (если включены системки)
			this.sys_msg='<font class=date2>'+cur_time+'</font> Кликнули объект <b>'+Obj.name+'</b>, ';
		      top.frames[3].location=loc+"?useobj="+Obj.id;
		      return;
		    } else if(this.autoAttack && (doc_inner.search(/DIV(.{2,18})LeftFront0_0/i)<0)) {//-- Нападать если нет стены
		      if(Obj.action && Obj.action.search(/attack/)>=0) {
			if( (100*top.tkHP/top.maxHP)>this.minHP) {
			  top.frames[3].location=loc+"?attack="+Obj.id;
			  return;
			} else {
			  var timeout_HP = 180000*(top.maxHP*this.minHP/100-top.tkHP)/(top.speed*top.maxHP)*1000;
			  var timeout_Mana = ((top.maxMana||0)>100)?180000*(top.maxMana*this.minMana/100-top.tkMana)/(top.mspeed*top.maxMana)*1000:0;
			  var timeout = Math.max(timeout_HP, timeout_Mana);
			  //setTimeout("top.frames[3].location.reload()",180000*(top.maxHP-top.tkHP)/(top.speed*top.maxHP)*1000);//обновить когда будет 100% HP
			  setTimeout("top.frames[3].location=top.frames[3].location.href",180000*(top.maxHP*this.minHP/100-top.tkHP)/(top.speed*top.maxHP)*1000+10000);//обновить когда будет minHP HP
			}
		      }
		    }
		  }
		}
	    }
	

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

	maxT=1800/top.speed*100;
	T=Math.floor(maxT/top.maxHP*100);
		
	//alert(dT+' '+T);
	d.getElementsByTagName('table')[2].rows[0].cells[0].innerHTML+="(100HP/"+T+"сек.)"
	//top.Chat.am(t);
/*
//---------Вычисление своих координат
	if(arrMap=top.frames[3].arrMap){
		map_i=parseInt(0); 
		for(y=0;y<8;y++){
			for(x=0;x<8;x++){
				map_i*=2;
				map_i+=(arrMap[y][x] ? 1:0);
			}
		}
		//top.Chat.am(map_i.toString(10));
		if(this.Coordinates[map_i])
			d.getElementsByTagName('table')[4].rows[0].cells[0].innerHTML+="<br>"+"x:"+this.Coordinates[map_i].x+" y:"+this.Coordinates[map_i].y;
	}
*/			
		
        for (var i=1; i<8; i+=2)
          d.all['i'+i].onclick = top.combats_plugins_manager.get_binded_method(this,this.setDirection, i);

        d.all['td_stop'].onclick = top.combats_plugins_manager.get_binded_method(this,this.stop_it);
        d.all['en_click'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
        d.all['mat_click'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
//        d.all['ignoreWall'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
        d.all['autoPilot'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
        d.all['autoAttack'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
        d.all['showMap'].onclick = top.combats_plugins_manager.get_binded_method(this,this.doShowMap);
		
        if (this.Direction) {
          img=d.all("i"+this.Direction);
          img.src=img.src.replace(/\.gif$/,"b.gif");
        } else
          d.all("td_stop").style.backgroundColor="red";

        this.doShowMap();

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
                setTimeout("top.frames[3].location=top.frames[3].location.pathname+'?rnd="+Math.random()+"&path=rr';",100);
              else if (el && !er)
                setTimeout("top.frames[3].location=top.frames[3].location.pathname+'?rnd="+Math.random()+"&path=rl';",100);
              return;
            }
          }
        }

        var mtime = top.frames[3].mtime*(1-(top.frames[3].progressAt/top.frames[3].progressEnd));
        if (mtime<0)
          mtime = 0;
        if(!this.forced || this.steptimer==null || mtime==0) {
          if (d.getElementById("m"+this.Direction) && (this.Direction!=1 || !("l2op1" in d.all) || d.all["l2op1"].childNodes.length>1 )){
            this.StartStepTimer(this.do_step, mtime);
	  }
        }
        d.parentWindow.attachEvent("onbeforeunload",top.combats_plugins_manager.get_binded_method(this,this.onunloadHandler));
      } catch (e) {
        e.Function = 'onLoadHandler';
        combats_plugins_manager.logError(this,e);
      }
    },

    
    getMapPosition: function(Map, arrMap) {
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
        if (found)
          return {x:map_x+4, y:map_y+4};
        map_y = search_map_row(map_y+1);
      }
      return null;
    },

    "getCurrentFloor": function() {
      try {
        return top.frames[3].document.getElementsByTagName('table')[0].cells[1].innerHTML.replace(/^(?:^.*?\s)?(Этаж\s+\d+).*?\s*-.*$/,'$1');
      } catch(e) {
      }
    },
    
    "doShowMap": function() {
      if (this.mapTargetMenu)
        this.mapTargetMenu.style.display = 'none';
      var b = top.frames[3].document.getElementById('showMap');
      if (!b || b.checked) {
        this.setCurrentSettings();
        if (!this.mapPanel) {
          this.mapPanel = combats_plugins_manager.createWindow('Карта', 320, 240, combats_plugins_manager.get_binded_method(this,this.doHideMap,true));
          var div = top.document.createElement('<div style="width:100%; height:100%; overflow: scroll;">');
          this.div = top.document.createElement('<div style="position: relative">');
          div.insertBefore( this.div, null );
          oPanel.oWindow.Insert( div );
        }
// debugger;
        var Map;
        this.dungeonName = top.frames['activeusers'].document.getElementById('room').innerText.replace(/\s+\(\d+\)$/,'')
        var mapFileName = 'walk\\'+this.dungeonName+'.js';
        if (this.mapFileName!=mapFileName) {
          var s = external.readFile(
            top.combats_plugins_manager.security_id,
            "Combats.RU",
            mapFileName) || '';
          if (s) {
            this.Map = eval('(function(){ return '+s+' })()');
            this.mapFileName = mapFileName;
          } else {
            this.Map = null;
          }
        }
        var floor = this.getCurrentFloor();
        Map = this.Map ? this.Map[floor] : null;
        while (this.div.firstChild)
          this.div.removeChild(this.div.firstChild);
        if (Map) {
          this.div.style.width = ''+((Map.length-8)*15)+'px';
          this.div.style.height = ''+((Map[0].length-8)*15)+'px';
          var selectMapTarget = combats_plugins_manager.get_binded_method(this,this.selectMapTarget);
          for(var i=4; i<Map.length-4; i++)
            for(var j=4; j<Map[i].length-4; j++) {
              if (Map[i][j]) {
                var cell = top.document.createElement('<div style="position: absolute; width:17px; height:17px; background: url(http://img.combats.com/i/sprites/map/'+Map[i][j]+'.gif) no-repeat center center; left:'+(j*15-60)+'px; top:'+(i*15-60)+'px">');
                this.div.insertBefore(cell, null);
                cell.onclick = selectMapTarget;
                cell.mapX = j;
                cell.mapY = i;
              }
            }
          if (top.frames[3].arrMap[4][4].constructor == top.frames[3].Array)
            top.frames[3].arrMap[4][4] = top.frames[3].arrMap[4][4][0];
          this.position = this.getMapPosition(Map, top.frames[3].arrMap);
          if (this.position) {
            var cell = top.document.createElement('<div style="position: absolute; width:7px; height:7px; background: url(http://img.combats.com/i/move/p1/d0.gif) no-repeat center center; left:'+(this.position.x*15-55)+'px; top:'+(this.position.y*15-59)+'px" title="Текущее местонаходение">');
            this.div.insertBefore(cell, null);
          }
          if (this.destination) {
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
      if (this.mapPanel)
        this.mapPanel.oWindow.Hide();
      if (permanent) {
        var input = top.frames[3].document.all['showMap'];
        if (input) {
          input.checked = false;
          this.setCurrentSettings();
        }
      }
      if (this.mapTargetMenu)
        this.mapTargetMenu.style.display = 'none';
    },

    "displayDestinationPointer": function(position) {
      if (!this.pointer)
        this.pointer = top.document.createElement('<div style="position: absolute; width:9px; height:13px; background: url(file:///'+combats_plugins_manager.base_folder+'/walk/arrow.gif) no-repeat; line-height: 1px">');
      this.pointer.style.left = ''+(position.x*15-56)+'px';
      this.pointer.style.top = ''+(position.y*15-55)+'px';
      this.pointer.style.display = '';
      this.div.insertBefore(this.pointer, null);
    },

    "selectMapTarget": function(e) {
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
        this.pointer.style.display = 'none';
        this.runToPont(this.selectedPosition);
      });
      this.mapTargetMenu.insertBefore(item, null);
      top.document.body.insertBefore(this.mapTargetMenu, null);
      this.mapTargetMenu.style.display = '';
    },
    
    "runToPont": function(position) {
      this.Direction=0;
      this.destination = position;
      this.makeStep();
    },

    "createPath": function() {
      var floor = this.getCurrentFloor();
      var _map = this.Map ? this.Map[floor] : null;
      if (_map) {
        var Map = [];
        var wave = [];
        for(var i in _map) {
          Map[i] = [];
          wave[i] = [];
          for(var j in _map[i]) {
            Map[i][j] = _map[i][j]
            wave[i][j] = 0;
          }
        }
        var completeObj = {};
        var currLen = 1;
        wave[this.destination.y][this.destination.x] = currLen;
        try {
          while(true) {
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
                    if (i==this.position.y && j==this.position.x) {
                      throw completeObj;
                    }
                  }
                }
              }
            }
            currLen++;
          }
        } catch (e) {
          if (e == completeObj) {
            var x = this.position.x;
            var y = this.position.y;
	    var cell = Map[y][x];
            if (cell.indexOf('1')<0 && wave[y-1][x]==currLen) {
              return {x:x,y:y-1,d:1};
            } else if (cell.indexOf('3')<0 && wave[y][x+1]==currLen) {
              return {x:x+1,y:y,d:3};
            } else if (cell.indexOf('5')<0 && wave[y+1][x]==currLen) {
              return {x:x,y:y+1,d:5};
            } else if (cell.indexOf('7')<0 && wave[y][x-1]==currLen) {
              return {x:x-1,y:y,d:7};
            }
          }
        }
      }
    },
    
    "checkDirection": function(path) {
      var match = top.frames[3].document.body.innerHTML.match(/>смотрим на (север|юг|запад|восток)<\//i);
      if (match) {
        var direction = {'север':1,'восток':3,'юг':5,'запад':7}[match[1]];
        if (direction==path.d)
          return true;
        if (direction==1 && path.d==3 || direction==3 && path.d==5 || direction==5 && path.d==7 || direction==7 && path.d==1) {
          // turn right;
          setTimeout("top.frames[3].location=top.frames[3].location.pathname+'?rnd="+Math.random()+"&path=rr';",100);
          return false;
        }
        // turn left;
        setTimeout("top.frames[3].location=top.frames[3].location.pathname+'?rnd="+Math.random()+"&path=rl';",100);
        return false;
      }
    },

    "doStep": function() {
      this.StartStepTimer(function(){
        try {
          var units = top.frames[3].arrLayers[1][0].l.arrUnits;
          for(var i in units) {
            // если есть хотя бы один противник, ждём 10 секунд и обновляем
            if (!units[i].maxHP) {
              combats_plugins_manager.fireEvent('dungeon_walk.enemy', {units:units});
              this.StartStepTimer(function(){
                top.frames[3].location=top.frames[3].location.pathname+'?rnd='+Math.random();
              }, 10);
              return;
            }
          }
        } catch(e) {
        }
        top.frames[3].location=top.frames[3].location.pathname+'?rnd='+Math.random()+'&path=m1';
      },top.frames[3].mtime+0.1);
    },
    
    "makeStep": function() {
      var floor = this.getCurrentFloor();
      if (floor!=this.destination.floor) {
        this.destination = null;
        combats_plugins_manager.fireEvent('dungeon_walk.finish', {position:null});
        return;
      }
      var Map = this.Map ? this.Map[floor] : null;
      if (Map) {
        if (top.frames[3].arrMap[4][4].constructor == top.frames[3].Array)
          top.frames[3].arrMap[4][4] = top.frames[3].arrMap[4][4][0];
        this.position = this.getMapPosition(Map, top.frames[3].arrMap);
        if (this.position.x!=this.destination.x || this.position.y!=this.destination.y) {
          var path = this.createPath();
          if (this.checkDirection(path)) {
            this.doStep();
          }
        } else {
          this.destination = null;
          combats_plugins_manager.fireEvent('dungeon_walk.finish', {position:this.position});
        }
      }
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

	top.combats_plugins_manager.attachEvent(
          'mainframe.load',
	  top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
	this.clearUsedObjects();
/*
	this.Coordinates=new Array();
	if(t = external.readFile(top.combats_plugins_manager.security_id,"Combats.RU","walk\\coordinates.ini")){ //загрузка индексов координат
	  	s=t.split(/[\x0A\x0D]+/);
	  	for(i in s){
	  		top.Chat.am("3");
	  		t=s[i].split(" ");
	  		this.Coordinates[t[0]]={x:t[1],y:t[2]};
	  	}
	}
*/
	this.forced=(this.load('forced','no')=='yes');
	this.ignoreWall=(this.load('ignoreWall','no')=='yes');
	this.showUnits=(this.load('showUnits','yes')=='yes');
	this.showObjects=(this.load('showObjects','yes')=='yes');
	this.autoHideMap = (this.load('autoHideMap','yes')=='yes');
	this.minHP=parseInt(this.load('minHP','95'));
	this.excludedObjects=this.load('exclude','').replace(/;/g, "\n");
	var items=this.load('excludeItems','').split(/;/);
	this.excludedItems = {};
	for(var i=0; i<items.length; i++)
          this.excludedItems[items[i]] = true;
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