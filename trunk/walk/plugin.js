(function() {
  plugin_walk = function() {
    this.Direction = 0;
    this.en_click=false;
    this.mat_click=false;
    this.ignoreWall=false;
    this.autoPilot=true;
	this.autoAttack=false;
    this.steptimer=null;
    this.forced=false;
	this.showUnits=true;
	this.showObjects=true;
	this.minHP = 95;
	this.excludedObjects='';
    this.skip_quest=false;
    this.usedObjects=new Object();
	this.sys_msg = '';
	//this.Coordinates=new Array();
    this.init();
  }

  plugin_walk.prototype = {
    "toString": function() {
      return "Бродилка по пещере";
    },
	
    "load": function(key,def_val){
	  return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","walk\\walk.ini",top.getCookie('battle'),key,def_val);
    },
    "save": function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","walk\\walk.ini",top.getCookie('battle'),key,val);
    },
    "getProperties": function() {
	
      return [
        { name: "\"Опережающий\" таймер", value: this.forced },
		{ name: "Отображать монстров на радаре", value: this.showUnits },
		{ name: "Отображать объекты на радаре", value: this.showObjects },
		{ name: "Минимум HP для автонападения", value: this.minHP},
		{ name: "Список исключенных <br>из автокликера объектов", value: this.excludedObjects, type:"textarea"}
      ];
    },

    "setProperties": function(a) {
      this.forced=a[0].value;
	  this.showUnits=a[1].value;
	  this.showObjects=a[2].value;
	  this.minHP=a[3].value;
	  this.excludedObjects=a[4].value;

	  this.save('forced',this.forced?"yes":"no");
	  this.save('showUnits',this.showUnits?"yes":"no");
	  this.save('showObjects',this.showObjects?"yes":"no");
	  this.save('minHP',this.minHP);
	  this.save('exclude',this.excludedObjects.replace(/\s*[\n\r]+\s*/g,";"));
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
          this.StartStepTimer(mtime);
        }
		this.setCurrentSettings();
    },

    "StartStepTimer": function(sec) {
      try {
        if(this.steptimer!=null)
          clearTimeout(this.steptimer);
        this.steptimer=setTimeout(top.combats_plugins_manager.get_binded_method(this,this.do_step),1000*sec+100);
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
               if (oObjects[i].currentStyle.filter.search("src='http://img.combats.ru/i/chars/d/")>=0
                   && (oObjects[i].nextSibling==null || oObjects[i].nextSibling.className!='Life')) {
                 canStep = false;
                 break;
               }
        }

        if(this.Direction>0 && canStep) {
          top.frames[3].location=top.frames[3].location.pathname+"?rnd="+Math.random()+"&path=m"+this.Direction;
          if(this.forced)
            this.StartStepTimer(15);
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
        this.ignoreWall=top.frames[3].document.all['ignoreWall'].checked;
        this.autoPilot=top.frames[3].document.all['autoPilot'].checked;
        this.autoAttack=top.frames[3].document.all['autoAttack'].checked;
		
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
        if(d.location.pathname.search(/^\/dungeon\d*\.pl/)!=0)
          return;
		var doc_inner=d.body.innerHTML.toString(); // ----------- Added by Solt
		var cur_time = (new Date()).toLocaleTimeString(); // ------------ Added by Solt
		var loc="http://"+d.location.hostname+d.location.pathname; // ------------ Added by Solt
        tables = d.getElementsByTagName('TABLE');
	    if(!top.ChatSys) top.bottom.sw_sys(); //--------------- Включаем системки
		
		if( (Red_str=doc_inner.match(/red>(.*?)<BR>/)) && this.sys_msg ){ // ------- вывод системки (на что кликнули и каков результат) ------- Added by Solt
			top.Chat.am(this.sys_msg + '<i>'+Red_str[1]+'<i>');
			this.sys_msg='';
		}

        if (tables.length<2 || tables[0].cells.length<2 
          || tables[0].cells[1].getElementsByTagName('A').length!=1 
		  || tables[0].cells[1].getElementsByTagName('A')[0].href.search(/\?out=/)<0) {
          return;
		}

        if (tables[0].rows(1).cells(0).innerText.search('У вас слишком много таких объектов')>=0) {
          this.skip_quest = true;
        }

        if (tables[0].rows(1).cells(0).innerText.search('Не хватает места')>=0) {
          this.skip_quest = true;
		  this.skip_mat_click = true;
          setTimeout(top.combats_plugins_manager.get_binded_method(
            this,
            function(){
              alert('Наведите порядок в рюкзаке');
			  this.skip_mat_click = false;
              this.skip_quest = false;
            }),0);
        }
		  
// ---------- try drop ----------
        for(i=0;i<d.links.length;i++) {
          link=d.links(i);
          if (link.href.search(/dungeon\d*\.pl\?get=/)>=0 && (this.mat_click && !this.skip_mat_click || (link.children(0).src.search(/mater\d\d\d\.gif/)>=0 && !this.skip_quest))) {
            top.frames[3].location = link.href;
            return;
          }
        }

//---------- Создание пустого радара 		
		tab='<table border=0 cellspacing=8 cellpadding=0 id="Radar_table">';
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
				for(var rl in arrLayers[y][x])
					for(var o in arrLayers[y][x][rl])
						for(var i in arrLayers[y][x][rl][o]){
							var Obj=arrLayers[y][x][rl][o][i];
							var Obj_X=parseInt(rl=='r'? x:-x);
							var Obj_Y=parseFloat(y);
								if(top.frames[3].nMyDirection & 2){ //если направление 3 или 7, поворачиваем координаты направо
									tmp=Obj_X;
									Obj_X=Obj_Y;
									Obj_Y=-tmp;
								}
								if(top.frames[3].nMyDirection & 4){ //если 5 или 7, координаты разворачиваем на 180гр
									Obj_X=-Obj_X;
									Obj_Y=-Obj_Y;
								}
								if(R_t.rows[-Obj_Y+3].cells[Obj_X+3].style.backgroundColor!='red')
									if(o=='arrObjects' || (Obj.HP) )
										R_t.rows[-Obj_Y+3].cells[Obj_X+3].style.backgroundColor=(this.showObjects ? 'green':'');
									else
										R_t.rows[-Obj_Y+3].cells[Obj_X+3].style.backgroundColor=(this.showUnits ? 'red':'');
								if(R_t.rows[-Obj_Y+3].cells[Obj_X+3].title!="")
									R_t.rows[-Obj_Y+3].cells[Obj_X+3].title+="\n";
								R_t.rows[-Obj_Y+3].cells[Obj_X+3].title+=Obj.name;
								
								if((x==0 && y==1) || (y==0 && x==1)){ //---------------- если спереди или с боков, кликаем.
									if( o=='arrObjects' && !(Obj.id in this.usedObjects) && this.en_click && this.excludedObjects.indexOf(Obj.name)==-1){ //-------Кликать на объекты
										this.usedObjects[Obj.id]=true;
										if(top.ChatSys) //------------ Добавить к логу на что кликали (если включены системки)
											this.sys_msg='<font class=date2>'+cur_time+'</font> Кликнули объект <b>'+Obj.name+'</b>, ';
										top.frames[3].location=loc+"?useobj="+Obj.id;
										return;
									}else if(this.autoAttack && (doc_inner.search(/DIV(.{2,18})LeftFront0_0/i)<0)){//-- Нападать если нет стены
										if(Obj.action && Obj.action.search(/attack/)>=0){
											if( (100*top.tkHP/top.maxHP)>this.minHP){
												top.frames[3].location=loc+"?attack="+Obj.id;
												return;
											}else{
												//setTimeout("top.frames[3].location.reload()",180000*(top.maxHP-top.tkHP)/(top.speed*top.maxHP)*1000);//обновить когда будет 100% HP
												setTimeout("top.frames[3].location.reload()",180000*(top.maxHP*this.minHP/100-top.tkHP)/(top.speed*top.maxHP)*1000);//обновить когда будет minHP HP
											}
										}
									}
								}
						}
	

        tables[0].rows(1).cells(0).innerHTML += '<table><tr><td><table>\
    <tr><td><td><img id="i1" src="http://img.combats.ru/i/move/navigatin_52.gif" style="cursor:pointer"><td>\
    <tr><td><img id="i7" src="http://img.combats.ru/i/move/navigatin_59.gif" style="cursor:pointer" onclick="this.setDirection(7)"><td id="td_stop" style="background-color:black;"><td><img id="i3" src="http://img.combats.ru/i/move/navigatin_62.gif" style="cursor:pointer" onclick="this.setDirection(3)">\
    <tr><td><td><img id="i5" src="http://img.combats.ru/i/move/navigatin_67.gif" style="cursor:pointer" onclick="this.setDirection(5)"><td></table>\
    <td>\
    <input type="checkbox" id="en_click"'+(this.en_click?' CHECKED':'')+'>&nbsp;Кликать по объектам<br>\
    <input type="checkbox" id="mat_click" onclick="this.mat_click=this.checked"'+(this.mat_click?' CHECKED':'')+'>&nbsp;Собирать ингридиенты<br>\
    <input type="checkbox" id="ignoreWall" onclick="if(this.ignoreWall=this.checked)document.all.autoPilot.checked=this.autoPilot=false"'+(this.ignoreWall?' CHECKED':'')+'>&nbsp;Игнорировать препятствия<br>\
    <input type="checkbox" id="autoPilot" onclick="if(this.autoPilot=this.checked)document.all.ignoreWall.checked=this.ignoreWall=false"'+(this.autoPilot?' CHECKED':'')+'>&nbsp;Автонавигация<br>\
    <input type="checkbox" id="autoAttack" onclick="this.autoAttack=this.checked;"'+(this.autoAttack?' CHECKED':'')+'>&nbsp;Автонападение<br>\
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
        d.all['ignoreWall'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
        d.all['autoPilot'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
        d.all['autoAttack'].onclick = top.combats_plugins_manager.get_binded_method(this,this.setCurrentSettings);
		
        if (this.Direction) {
          img=d.all("i"+this.Direction);
          img.src=img.src.replace(/\.gif$/,"b.gif");
        } else
          d.all("td_stop").style.backgroundColor="red";

		
		getElement=d.getElementById;
        if (this.autoPilot) {
          if (this.Direction && !getElement("m"+this.Direction)) {
            if (getElement("m1")) {
              this.setDirection(1);
            } else {
              el = getElement("m"+((this.Direction+6)%8));
              er = getElement("m"+((this.Direction+2)%8));
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
          if (getElement("m"+this.Direction) && (this.Direction!=1 || !("l2op1" in d.all) || d.all["l2op1"].childNodes.length>1 )){

            this.StartStepTimer(mtime);
		  }
        }
        d.parentWindow.attachEvent("onbeforeunload",top.combats_plugins_manager.get_binded_method(this,this.onunloadHandler));
      } catch (e) {
        e.Function = 'onLoadHandler';
        combats_plugins_manager.logError(this,e);
      }
    },

    "init": function() {
      top.combats_plugins_manager.attachEvent(
        'mainframe.load',
        top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
      this.clearUsedObjects();
	  /*
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
	  this.showUnits=(this.load('showUnits','yes')=='yes');
	  this.showObjects=(this.load('showObjects','yes')=='yes');
	  this.minHP=parseInt(this.load('minHP','95'));
	  this.excludedObjects=this.load('exclude','').replace(/;/g, "\n");
	  if( /walkSettings=(\d+)/.test( document.cookie ) ){
		t = parseFloat( document.cookie.match( /walkSettings=(\d+)/ )[ 1 ] );
		
	  	this.en_click=((t & 8)>0);
	  	this.mat_click=((t & 16)>0);
      	this.ignoreWall=((t & 32)>0);
      	this.autoPilot=((t & 64)>0);
      	this.autoAttack=((t & 128)>0);
		
		this.Direction=(t & 7);
	  }
    }
  };
    
  return new plugin_walk();
})()