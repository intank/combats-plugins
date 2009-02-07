(function(){
  return {
    attempts_limit: 5,
    pathes: null,
    favorites: ['Общ. Этаж 2','Портал','Зал воинов 3','Филиал Аукциона'],
    toString: function() {
      return 'Перемещение в заданную локацию';
    },
    getProperties: function() {
      if (this.pathes) {
        var locations_count = 0;
        var locations_list = [];
        for(var location in this.pathes) {
          locations_list.push(location);
        }
        locations_list.sort();
        locations_list.selected = 0;
        return [
          { name:"Запомнить переходы локации", value:this.savePathes },
          { name:"Экспорт переходов в файл", value:this.exportPathes },
          { name:"Предпочитаемые локации", value:this.favorites.join('\n'), type:'textarea' }
        ];
      } else {
        return [
          { name:"Запомнить переходы локации", value:this.savePathes },
          { name:"Экспорт переходов в файл", value:this.exportPathes }
        ];
      }
    },
    setProperties: function(a) {
      if (a.length!=3)
        return;
      this.favorites = a[2].value.split(/\s*[;,\n\r]+\s*/);
      while(this.favorites.length && !this.favorites[0])
        this.favorites.shift();
      this.config.saveIni('favorites.'+this.city,this.favorites.join(';'));
    },
    analyze_step: function(new_step, from, pathes) {
      if (!(from in this.steps))
        this.steps[from] = {};
      if (!pathes)
        pathes = this.pathes[from];

      for(var next in pathes) {
        var next_name = pathes[next];
        if (!(next_name in this.steps[from])) {
          this.steps[from][next_name] = new_step;
          this.can_step = true;
        }
        if (next_name==this.new_location) {
          throw new Error('Destination was found');
        }
      }
    },
    search_next_step: function() {
      var next = this.new_location;
      for(this.step += 1; this.step>1; this.step--) {
        var next_flag = false;
        for(var from in this.steps) {
          for(var dest in this.steps[from]) {
            if (this.steps[from][dest]==this.step && dest==next) {
              next = from;
              next_flag = true;
              break;
            }
          }
          if (next_flag)
            break;
        }
      }
// debugger;
      this.search_step_to(next);
    },
    search_step_to: function(location) {
      var doc = combats_plugins_manager.getMainFrame().document;
      var moveto = doc.getElementById('moveto');
      this.step_node = null;
      if (moveto && moveto.firstChild.tagName=='TABLE' && moveto.firstChild.rows.length>0) {
        for(var i=0; i<moveto.firstChild.rows.length; i++) {
          if (moveto.firstChild.rows[i].cells[1].firstChild.tagName == 'A' 
              && moveto.firstChild.rows[i].cells[1].firstChild.innerText.indexOf(location)>=0) {
            this.step_node = moveto.firstChild.rows[i].cells[1].firstChild;
            break;
          }
        }
      }
      if (!this.step_node) {
        var ione = doc.getElementById('ione');
        if (ione) {
          for(var i=0; i<ione.children.length; i++) {
            if (ione.children[i].tagName == 'DIV' 
                && ione.children[i].firstChild 
                && ione.children[i].firstChild.onclick 
                && ione.children[i].firstChild.onclick.toString().indexOf("'"+location+"'")>=0) {
              this.step_node = ione.children[i].firstChild;
              break;
            }
          }
        }
      }
      if (this.step_node) {
        setTimeout(
          combats_plugins_manager.get_binded_method(this, this.click_step_node), 
          (combats_plugins_manager.getMainFrame().progressEnd-combats_plugins_manager.getMainFrame().progressAt)*combats_plugins_manager.getMainFrame().progressInterval+500);
      } else {
        if (++this.step_attempt>this.attempts_limit) {
          combats_plugins_manager.detachEvent('mainframe.load',
            this.mainframeHandler);
          combats_plugins_manager.add_chat('<font class=date2>'+(new Date().toLocaleTimeString())+'</font> <i>Не удалось перемещение в "'+this.new_location+'" за '+this.attempts_limit+' попыток</i>')
          return;
        }
        setTimeout(
          combats_plugins_manager.get_binded_method(this, this.try_run_to_new_location),
          3500);
      }
    },
    click_step_node: function() {
      if (this.prev_location == this.current_location) {
        if (++this.click_attempt>this.attempts_limit) {
          combats_plugins_manager.detachEvent('mainframe.load',
            this.mainframeHandler);
          combats_plugins_manager.add_chat('<font class=date2>'+(new Date().toLocaleTimeString())+'</font> <i>Не удалось перемещение в "'+this.new_location+'" за '+this.attempts_limit+' попыток</i>')
          return;
        }
      } else {
        this.click_attempt = 0;
        this.prev_location = this.current_location;
      }
      this.step_attempt = 0;
      this.step_node.click();
      if ('chat_sender' in combats_plugins_manager.plugins_list) {
        setTimeout(
          function() { combats_plugins_manager.plugins_list.chat_sender.refreshChat(); },
          1500);
      }
    },
    check_complete: function() {
      if (this.current_location==this.new_location) {
        combats_plugins_manager.detachEvent('mainframe.load',
          this.mainframeHandler);
        return true;
      }
      return false;
    },
    try_run_to_new_location: function() {
      this.current_location = top.frames['activeusers'].document.getElementById('room').innerText.replace(/\s*\(.*$/,'');
      if (this.check_complete())
        return;

      this.steps = {};
      this.can_step = false;
      try {
        this.step = 0;
        this.analyze_step(this.step+1, this.current_location);
        if (!this.can_step) {
          this.analyze_step(this.step+1, this.current_location, this.getAvailableSteps());
        }
        for(this.step = 1; this.can_step; this.step++) {
          this.can_step = false;
          for(var from in this.steps) {
            for(var dest in this.steps[from]) {
              if (this.steps[from][dest]==this.step) {
                this.analyze_step(this.step+1, dest);
              }
            }
          }
        }
      } catch(e) {
        if (e.message!='Destination was found')
          throw e;
      }
      this.search_next_step();
    },
    run_to_location: function(new_location) {
      this.step_attempt = 0;
      if (typeof(new_location)=='string')
        this.new_location = new_location;
      else
        this.new_location = new_location[0].value[new_location[0].value.selected];
      if (!this.mainframeHandler) {
        this.mainframeHandler = combats_plugins_manager.get_binded_method(
          this, this.try_run_to_new_location);
      }
      this.prev_location = '';
      combats_plugins_manager.attachEvent('mainframe.load',
        this.mainframeHandler);
      this.try_run_to_new_location();
    },
    locationClicked: function() {
      if (this['debugger']) debugger;
      if (window.event.srcElement.nodeName!='TD') return;

      if (window.event.srcElement.attributes['run_to_location_all']) {
        if (!this.locationsWindow) {
          this.locationsWindow = combats_plugins_manager.createWindow("Локации города", 320, 480);

          var locations_count = 0;
          var locations_list = [];
          for(var location in this.pathes) {
            locations_list.push(location);
          }
          locations_list.sort();

          var s = '';
          for(var i=0; i<locations_list.length; i++) {
            s += '<tr><td style="width:100%; height: 1em; padding:2px 10px; cursor: pointer; font-weight: bold; vertical-align: middle">'+locations_list[i]+'</td></tr>';
          }
          var div = document.createElement('<div style="width:100%; height:100%; overflow-y:scroll">');
          div.innerHTML = '<table style="width: 100%">'+s+'</table>';
          this.locationsWindow.oWindow.Insert(div);
          div.firstChild.onclick=combats_plugins_manager.get_binded_method(this, this.locationClicked);
        }
        this.locationsWindow.oWindow.Show();
      } else {
        if (this.locationsWindow)
          this.locationsWindow.oWindow.Hide();
        this.run_to_location(window.event.srcElement.innerText);
      }
      if (this.menu)
        this.menu.parentNode.removeChild(this.menu);
      this.menu = null;
    },
    selectLocation: function() {
      if (this.menu) {
        this.menu.parentNode.removeChild(this.menu);
        this.menu = null;
        return;
      }
      this.menu = top.document.createElement('div');
      var s = '';
      for(var i=0; i<this.favorites.length; i++) {
        s += '<tr><td style="width:100%; height: 2em; padding:2px 10px; cursor: pointer; font-weight: bold; vertical-align: middle">'+this.favorites[i]+'</td></tr>';
      }
      s += '<tr><td style="width:100%; height: 2em; padding:2px 10px; cursor: pointer; font-weight: bold; vertical-align: middle" run_to_location_all="1">Все локации города...</td></tr>';
      this.menu.innerHTML = '<table style="border: 2px solid black; width: 100%">'+s+'</table>';
      this.menu.style.cssText = 'position: absolute; z-index: 5; left: '+(window.event.clientX-window.event.offsetX)+'px; top: '+(window.event.clientY-window.event.offsetY+30)+'px; width: 200px; height: auto; background: #C7C7C7';
      top.document.body.insertBefore(this.menu);
      this.menu.attachEvent(
        'onclick',
        combats_plugins_manager.get_binded_method(this, this.locationClicked)
      );
    },

    savePathes: function() {
      var current_location = top.frames['activeusers'].document.getElementById('room').innerText.replace(/\s*\(.*$/,'');

      if (this.pathes)
        this.pathes[current_location] = [];

      var availableSteps = this.getAvailableSteps();
      for(var i in availableSteps)
        this.addPath(current_location, availableSteps[i]);
    },
    getAvailableSteps: function() {
      var doc = combats_plugins_manager.getMainFrame().document;
      var result = [];

      var moveto = doc.getElementById('moveto');
      if (moveto && moveto.firstChild.tagName=='TABLE' && moveto.firstChild.rows.length>0) {
        for(var i=0; i<moveto.firstChild.rows.length; i++) {
          if (moveto.firstChild.rows[i].cells[1].firstChild.tagName == 'A') {
            if (moveto.firstChild.rows[i].cells[1].firstChild.innerText)
              result.push(moveto.firstChild.rows[i].cells[1].firstChild.innerText);
          }
        }
      }
      var ione = doc.getElementById('ione');
      if (ione) {
        for(var i=0; i<ione.children.length; i++) {
          if (ione.children[i].tagName == 'DIV' 
              && ione.children[i].firstChild 
              && ione.children[i].firstChild.onclick) {
            var match = ione.children[i].firstChild.onclick.toString().match(/solo\s*\(\s*'(.*?)'\s*,\s*'(.*?)'\s*,.*?\)/);
            if (match && match[2]) {
              result.push(match[2]);
            }
          }
        }
      }
      return result;
    },
    addPath: function(from, to) {
      if (!this.pathes)
        this.pathes = {};
      if (!(from in this.pathes)) {
        this.pathes[from] = [];
      }
      for(var i in this.pathes[from])
        if (this.pathes[from][i]==to)
          return;
      this.pathes[from].push(to);
    },
    exportPathes: function() {
      var cities_array = [];

      var from_array = [];
      for(var from in this.pathes) {
        if (this.pathes[from].length<=0)
          continue;

        var to_array = [];
        for(var i in this.pathes[from]) {
          to_array.push('"'+this.pathes[from][i]+'"');
        }
        from_array.push('"'+from+'": ['+to_array.join(',')+']');
      }
      var output = '{}';
      if (from_array.length>0)
        output = '{\n'+from_array.join(',\n')+'\n}';
      external.writeFile(combats_plugins_manager.security_id,"Combats.RU",'run_to_location\\pathes_'+this.city+'.!.js',output);
    },

    Init: function() {
      this.city = top.location.host.replace(/\..*$/,'');
      top.combats_plugins_manager.plugins_list['top_tray'].addButton({
        'button': {
          'style': {
            'width': "32px",
            'height': "20px",
            'padding': "2px",
            'background': "#505050"
            },
          'onclick': combats_plugins_manager.get_binded_method(
            this, 
            this.selectLocation)
          },
        'img': {
          'style': {
            'width': "33px",
            'height': "24px",
            'left': "-2px",
            'top': "-1px",
            'position': "relative",
            'filter': "progid:DXImageTransform.Microsoft.BasicImage(Grayscale=1,Enabled=1)"
            },
          'onmouseout': function() {
              this.filters['DXImageTransform.Microsoft.BasicImage'].Enabled=1;
            },
          'onmouseover': function() {
              this.filters['DXImageTransform.Microsoft.BasicImage'].Enabled=0;
            },
          'src': "file:///"+combats_plugins_manager.base_folder+"run_to_location/run_to_location.gif",
          'alt': "Бежать по городу"
          }
        });
      try {
        var filename = 'run_to_location\\pathes_'+this.city+'.js';
        this.pathes = top.eval('(function(){ return '+external.readFile(combats_plugins_manager.security_id,"Combats.RU",filename)+'; })()');
        var newPathes = top.eval('(function(){ return '+external.readFile(combats_plugins_manager.security_id,"Combats.RU", 'run_to_location\\pathes_'+this.city+'.!.js')+'; })()');
        if (newPathes)
          combats_plugins_manager.add_chat(':idea: Внимание! Найден (но не загружен) альтернативный файл переходов: '+'run_to_location\\pathes_'+this.city+'.!.js');
        var warn_location = [];
        for(var from in this.pathes) {
          for(var i in this.pathes[from]) {
            if (!(this.pathes[from][i] in this.pathes)) {
              warn_location.push(this.pathes[from][i]);
              this.pathes[this.pathes[from][i]] = [];
            }
          }
        }
        if (warn_location.length>0) {
//          combats_plugins_manager.addLog(new Date().toLocaleString()+': Некоторые локации в '+this.city+' описаны не полностью: '+warn_location.join(', '));
        }
      } catch(e) {
        combats_plugins_manager.logError(this,'Не удалось загрузить маршруты перемещения по '+this.city);
      }
      this.config = combats_plugins_manager.createConfigurationElement('run_to_location');
      this.favorites = this.config.loadIni('favorites.'+this.city,'').split(/\s*[;,\n\r]+\s*/);
      while(this.favorites.length && !this.favorites[0])
        this.favorites.shift();
      return this;
    }
  }.Init();
})()