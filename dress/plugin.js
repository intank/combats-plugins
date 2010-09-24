(function () {
  function plugin_dress() {
    this.init();
  }
  /**/

  plugin_dress.prototype = {
    complect: [],
    inDungeon: false,
    clicked: false,
    selected: -1,
    trySelect: -1,
    div: "",
    oReq: null,
    sd4: top.sd4,
    toString: function() {
      return "Надевание комплектов";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","dress\\dress.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","dress\\dress.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      return [
        { name:"Всегда отображать в пещерах", value: this.alwaysInDungeon },
        { name:"Начать запись последовательности", value: this.sequenceStartRecording },
        { name:"Удалить инормацию о комплектах", value: this.clearStoredComplects }
      ];
    },
    setProperties: function(a) {
      this.alwaysInDungeon=a[0].value;
      top.combats_plugins_manager.detachEvent("mainframe.load",dress.activate);
      if (this.alwaysInDungeon)
        top.combats_plugins_manager.attachEvent("mainframe.load",dress.activate);
    },
    clearStoredComplects: function() {
      for(var j=0; j<6; j++)
        this.save(""+j,'0,[нет комплекта]');
    },
    recordingOnClick: function(type) {
      var obj = top.combats_plugins_manager.getMainFrame().event.srcElement;
      while (obj && obj.nodeName!='A')
        obj = obj.parentNode;
      if (!obj)
        return;
      if (type=='skmp') {
        var match = obj.href.match(/\/main\.pl\?skmp=(\d*?)&/);
        if (match) {
          this.sequence.push(type+':'+match[1]);
        }
      } else if (type=='set') {
        var match = obj.href.match(/\/main\.pl\?set=(.*?)&/);
        if (match) {
          this.sequence.push(type+':'+match[1]);
        }
      } else if (type=='setdown') {
        var match = obj.href.match(/\/main\.pl\?setdown=(.*?)&/);
        if (match) {
          this.sequence.push(type+':'+match[1]);
        }
      }
    },
    recordingOnLoad: function() {
      var document = top.combats_plugins_manager.getMainFrame().document;
      if (document.location.pathname!='/main.pl' 
          || !document.location.search.match(/\?(?:set=.+|edit=\d*|skmp=\d+|setdown=)/)) 
        return;

      var recordingOnClickSKmpHandler = top.combats_plugins_manager.get_binded_method(this, this.recordingOnClick, 'skmp');
      var recordingOnClickSetHandler = top.combats_plugins_manager.get_binded_method(this, this.recordingOnClick, 'set');
      var recordingOnClickSetDownHandler = top.combats_plugins_manager.get_binded_method(this, this.recordingOnClick, 'setdown');
      var links = document.links;
      for(var i=0; i<links.length; i++) {
        if (links[i].href.match(/\/main\.pl\?skmp=/)) {
          links[i].attachEvent('onclick',recordingOnClickSKmpHandler);
        } else if (links[i].href.match(/\/main\.pl\?set=/)) {
          links[i].attachEvent('onclick',recordingOnClickSetHandler);
        } else if (links[i].href.match(/\/main\.pl\?setdown=/)) {
          links[i].attachEvent('onclick',recordingOnClickSetDownHandler);
        }
      }
    },
    sequencePlayStop: function(result) {
      top.combats_plugins_manager.detachEvent(
        "mainframe.load",
        this.playingOnLoadHandler
      );
      if (!result)
        alert('как-то странно всё закончилось');
      if (this.sequencePlayCallback)
        this.sequencePlayCallback(false);
      return result;
    },
    sequencePlayNext: function() {
      var action = this.sequence.shift();
      if (!action) {
        return this.sequencePlayStop(true);
      }
      var document = top.combats_plugins_manager.getMainFrame().document;
      if (document.location.pathname!='/main.pl')
        return this.sequencePlayStop(false);

      action = action.split(':');
      var location = null;
        
      if (action[0]=='skmp') {
        location = '/main.pl?skmp='+action[1]+'&'+Math.random();
      } else if (action[0]=='set') {
        var links = document.links;
        for(var i=0; i<links.length; i++) {
          if ((match=links[i].href.match(/\/main\.pl\?set=(.*?)&/)) && match[1]==action[1]) {
            location = links[i].href;
            break;
          }
        }
      } else if (action[0]=='setdown') {
        location = '/main.pl?setdown='+action[1]+'&sd4='+this.sd4+'&'+Math.random();
      }
      if (location)
        document.location = location;
      else {
        return this.sequencePlayStop(false);
      }
    },
    sequencePlay: function(s, callback) {
      this.sequenceStopRecording();
      this.sequencePlayCallback = callback;
      this.sequence = s.split(';');
      this.playingOnLoadHandler = top.combats_plugins_manager.get_binded_method(this, this.sequencePlayNext);
      top.combats_plugins_manager.attachEvent(
        "mainframe.load",
        this.playingOnLoadHandler
      );
      top.combats_plugins_manager.getMainFrame().document.location = '/main.pl?edit=1&'+Math.random();
    },
    sequencePlayComplect: function() {
      var name = prompt('Введите название комплекта','Комплект');
      if (name===null)
        return;
      this.sequencePlay(this.load('complect.'+name,''));
    },
    sequenceStopRecording: function() {
      if (!this.recordingOnLoadHandler)
        return;
      top.combats_plugins_manager.detachEvent(
        "mainframe.load",
        this.recordingOnLoadHandler
      );
      this.recordingOnLoadHandler = null;
      var j = prompt('Введите номер комплекта [1-6]','1');
      if (j===null)
        return;
      j = parseInt(j)-1;
      var name = prompt('Введите название комплекта','Комплект');
      if (name===null)
        return;
      var s = this.sequence.join(';');
      this.complect[j] = {sequence:s, name: 'Надеть &quot;'+name+'&quot;'};
      this.save(""+j,'('+s+'),'+this.complect[j].name);
    },
    sequenceStartRecording: function() {
      if (this.recordingOnLoadHandler) {
        if (confirm('Запись последовательности уже выполняется. Остановить?')) {
          this.sequenceStopRecording();
        }
        return;
      }
      this.sequence = [];
      this.recordingOnLoadHandler = top.combats_plugins_manager.get_binded_method(this, this.recordingOnLoad);
      top.combats_plugins_manager.attachEvent(
        "mainframe.load",
        this.recordingOnLoadHandler
      );
    },
    onUnload: function() {
      top.dress.div="";
    },
    oReqReady: function() {
      if (dress.oReq.readyState == 4) {
        if (dress.oReq.status!=200) {
          alert('Что-то не так');
          return;
        }

        var match = dress.oReq.responseText.match(/var sd4 = '(\d+)';/);
        if (match != null) {
          dress.sd4 = match[1];
        }

	d = combats_plugins_manager.getMainFrame().document;

        match = dress.oReq.responseText.match(/(<table[^<>]+class="posit">[\s\S]*?<\/table><\/td>[\s\n\r]*<\/tr>[\s\n\r]*<\/table>[\s\n\r]*<\/td>[\s\n\r]*<\/tr>[\s\n\r]*<tr>[\s\n\r]*<td>[\s\S]*?<\/td>[\s\n\r]*<\/tr>[\s\n\r]*<\/table>)/);
        if (match) {
          var toyHTML = match[1];
	  var tables = d.getElementsByTagName('TABLE');
	  for(var i=0; i<tables.length; i++) {
	    if (tables[i].className=='posit') {
	      tables[i].outerHTML = toyHTML;
	      var w = combats_plugins_manager.getMainFrame();
	      if (w.gfastshow && !w.fastshow) {
		w.fastshow = w.gfastshow;
		w.hideshow = w.ghideshow;
	      }
	      if (w.fastshow && !w.gfastshow) {
		w.gfastshow = w.fastshow;
		w.ghideshow = w.hideshow;
	      }
	      break;
	    }
	  }
	}
        
        match = dress.oReq.responseText.match(/top\.setHP\(([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/);
        if (match != null) {
          top.setHP(parseFloat(match[1]),parseFloat(match[2]),parseFloat(match[3]));
        }
        match = dress.oReq.responseText.match(/top\.setMana\(([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/);
        if (match != null) {
          top.setMana(parseFloat(match[1]),parseFloat(match[2]),parseFloat(match[3]));
        }

        if (top.dress.div in d.all) {
          if (top.dress.inDungeon) {
            var imgs = d.all[top.dress.div].getElementsByTagName('img');
            var old_id = top.dress.selected==6?1:2+top.dress.selected;
            var new_id = top.dress.trySelect==6?1:2+top.dress.trySelect;
            imgs[old_id].filters.Glow.Enabled = '0';
            imgs[new_id].filters.Glow.Enabled = '1';
            imgs[new_id].filters.Glow.color = '#40FF40';
            imgs[new_id].filters.Glow.Strength = '5';
          } else {
            d.body.removeChild(d.all[top.dress.div]);
            top.dress.div = "";
            d.parentWindow.detachEvent( "onbeforeunload", top.dress.onUnload);
          }
        }
        top.dress.selected = top.dress.trySelect;
      }
    },
    click: function(slot) {
      if (top.dress.oReq == null) {
        if (top.XMLHttpRequest) {
          top.dress.oReq = new top.XMLHttpRequest();
        } else if (window.ActiveXObject) {
          top.dress.oReq = new ActiveXObject("Microsoft.XMLHTTP");
        } else
          return;
      }

      top.dress.trySelect=slot;
      top.dress.oReq.onreadystatechange = function(){};
      top.dress.oReq.abort();
      if (slot==6)
        top.dress.oReq.open('GET','http://'+top.location.host+'/main.pl?setdown=all&sd4='+top.dress.sd4+'&'+Math.random(),true);
      else {
        if ('id' in top.dress.complect[slot])
          top.dress.oReq.open('GET','http://'+top.location.host+'/main.pl?skmp='+top.dress.complect[slot].id+'&sd4='+top.dress.sd4+'&'+Math.random(),true);
        else if ('sequence' in top.dress.complect[slot]) {
          top.dress.sequencePlay(top.dress.complect[slot].sequence);
          return;
        }
      }
      top.dress.oReq.send();
      top.dress.oReq.onreadystatechange = this.oReqReady;
    },
    activate: function() {
      d = top.combats_plugins_manager.getMainFrame().document;
      if (d.readyState!="complete" && d.readyState!="loading") {
        d.parentWindow.detachEvent("onload", dress.activate);
        d.parentWindow.attachEvent("onload", dress.activate);
        return;
      }

      var clicked=dress.clicked;
      dress.clicked=false;
      try {
        if (dress.div in d.all) {
          d.body.removeChild(d.all[dress.div]);
          dress.div = "";
          d.parentWindow.detachEvent( "onbeforeunload", dress.onUnload);
        } else {
          top.dress.inDungeon = false;
          var tables = null;
          if (dress.alwaysInDungeon) {
            if (!clicked) {
              if (d.location.pathname.search(/^\/dungeon\d*\.pl/)==0) {
                top.dress.inDungeon = true;
                tables = d.getElementsByTagName('TABLE')
                if (tables.length<2 || tables[0].cells.length<2 
                    || tables[0].cells[1].getElementsByTagName('A').length!=1 || tables[0].cells[1].getElementsByTagName('A')[0].href.search(/\?out=/)<0)
                  return;
              } else
                return;
            }
          }

          dress.onloadHandler();

          var s = ""+Math.round((1+Math.random())*1e10);
          var map = d.createElement('<map name="dress_map_'+s+'" onmouseover="document.all.dress_img_'+s+'.style.cursor=\'pointer\'" onmouseout="document.all.dress_img_'+s+'.style.cursor=\'\'"></map>');
          var coords = [
            "50,15,15",
            "78,35,15",
            "78,65,15",
            "50,84,15",
            "21,65,15",
            "21,35,15",
            "50,50,15"
          ];

          var innerHTML = '<img id="img_dress_6_'+s+'" src="file:///'+combats_plugins_manager.base_folder+'dress/dress_out_'+dress.char+'.gif" alt="Снять всё" style="position:absolute; left:40; top:40; cursor:pointer; filter:Glow(color='+(dress.selected==6?'#40FF40':'#FF80FF')+',Strength=5,Enabled='+(dress.selected==6?1:0)+')" onclick="top.dress.click(6)" onmouseover="document.images.img_dress_6_'+s+'.filters.Glow.'+(dress.selected==6?'color=\'#FF80FF\'':'Enabled=1')+'" onmouseout="document.images.img_dress_6_'+s+'.filters.Glow.'+(dress.selected==6?'color=\'#40FF40\'':'Enabled=0')+'">';
          for(i=0;i<6;i++) {
            dress_coords = coords[i].split(',');
            innerHTML += '<img id="img_dress_'+i+'_'+s+'" src="file:///'+combats_plugins_manager.base_folder+'dress/icon.gif" alt="'+dress.complect[i].name+'" style="position:absolute; left:'+(dress_coords[0]-7)+'; top:'+(dress_coords[1]-7)+'; width:16px; height:16px; cursor:pointer; filter:Glow(color='+(dress.selected==i?'#40FF40':'#FF80FF')+',Strength=5,Enabled='+(dress.selected==i?1:0)+')" onclick="top.combats_plugins_manager.plugins_list.dress.click('+i+')" onmouseover="document.images.img_dress_'+i+'_'+s+'.filters.Glow.'+(dress.selected==i?'color=\'#FF80FF\'':'Enabled=1')+'" onmouseout="document.images.img_dress_'+i+'_'+s+'.filters.Glow.'+(dress.selected==i?'color=\'#40FF40\'':'Enabled=0')+'">';
            map.appendChild(d.createElement('<AREA SHAPE=CIRCLE COORDS="'+coords[i]+'" alt="'+dress.complect[i].name+'" onclick="top.combats_plugins_manager.plugins_list.dress.click('+i+')" >'));
          }
          map.appendChild(d.createElement('<AREA SHAPE=CIRCLE COORDS="'+coords[6]+'" alt="Снять всё" onclick="top.combats_plugins_manager.plugins_list.dress.click(6)" >'));
          
          var img = d.createElement('<img src="file:///'+combats_plugins_manager.base_folder+'dress/dress.gif" id="dress_img_'+s+'" usemap="#dress_map_'+s+'">');
          var div = d.createElement('<div id="dress_div_'+s+'" style="position:absolute; left:100; top:30; width:100px; height:100px; z-index:100"></div>');
          dress.div = 'dress_div_'+s;
          var el = null;
          if (top.dress.inDungeon) {
            div.style.position = "relative";
            div.style.top = "0px";
            div.style.left = "0px";
            el = tables[0].rows[1].cells[0].appendChild(div);
          }
          if (!el)
            el = d.body.appendChild(div);
          el.appendChild(map);
          el.appendChild(img);
          el.innerHTML += innerHTML;
          
          d.parentWindow.attachEvent( "onbeforeunload", dress.onUnload);
        }
      } catch (e) {
        combats_plugins_manager.logError(dress,e);
      }
    },
    onloadHandler: function() {
      if (top.combats_plugins_manager.getMainFrame().location.pathname.search(/^\/main\.pl/)!=0)
        return;
      d = top.combats_plugins_manager.getMainFrame().document;
      var tables = d.getElementsByTagName('table');
      if (tables.length<2 || tables[1].cells.length<6)
        return;
      var links = tables[1].cells[4].getElementsByTagName('a');
      var j = 0;
//debugger;
      for (i=0; i<links.length && j<6; i++) {
        match = links[i].href.match(/\/main\.pl\?skmp=(\d+)&/);
        if (match != null) {
          if ('sequence' in top.dress.complect[j]) {
            j++;
            continue;
          }
          top.dress.complect[j] = { "id":match[1], "name":links[i].innerText.split('"').join('&quot;') };
          top.dress.save(""+j,top.dress.complect[j].id+','+top.dress.complect[j].name);
          j++;
        }
      }
      if (tables.length<7 || tables[6].cells.length!=3)
        return;
      for(i=1; i<tables[6].cells[1].all.length; i++)
        if ("src" in tables[6].cells[1].all[i]) {
          matches = tables[6].cells[1].all[i].src.match(/http\:\/\/img\.combats\.(?:com|ru)\/i\/chars\/(\d+)\/.*?\.gif/);
          if (matches!=null) {
            this.char = matches[1];
            top.dress.save("char",this.char);
            break;
          }
        }
      
    },
    init: function() {
      for(var i=0;i<6;i++) {
        var s=this.load(""+i,"");
        if (match = s.match(/^\((.*)\),(.*)/))
          this.complect[i] = { "sequence":match[1], "name":match[2] };
        else {
          s = s.split(",");
          this.complect[i] = { "id":s[0], "name":s.slice(1).join(",") };
        }
      }

      if (this.alwaysInDungeon = true)
        top.combats_plugins_manager.attachEvent("mainframe.load",this.activate);
      this.char = this.load("char",'0');

      top.combats_plugins_manager.plugins_list['top_tray'].addButton({
        'button': {
          'style': {
            'width': "20px",
            'height': "20px",
            'padding': "2px",
            'background': "#505050"
            },
          'onclick': function() {
              with(top.combats_plugins_manager.plugins_list.dress) {clicked=true; activate();};
            }
          },
        'img': {
          'style': {
            'width': "16px",
            'height': "16px",
            'filter': "Glow(color=#DDDDDD,Strength=3,Enabled=0)"
            },
          'onmouseout': function() {
              this.filters.Glow.Enabled=0;
            },
          'onmouseover': function() {
              this.filters.Glow.Enabled=1;
            },
          'src': "file:///"+combats_plugins_manager.base_folder+"dress/icon.gif",
          'alt': "Переодевание"
          }
        });
    }
  }

  top.dress = new plugin_dress();
  return top.dress;
})()