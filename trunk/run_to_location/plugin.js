(function(){
  var plugin_run_to_location = {
    attempts_limit: 5,
    pathes: {
      'emeraldscity': {
        'Центральная площадь': ['Магазин', 'Комиссионка', 'Ремонтная мастерская', 'Страшилкина улица', 'Аукцион', 'Потеряный Вход', 'Магазин Березка', 'Портал', 'Банк'],
        'Магазин': ['Центральная площадь'],
        'Комиссионка': ['Центральная площадь'],
        'Ремонтная мастерская': ['Центральная площадь'],
        'Аукцион': ['Центральная площадь'],
        'Потеряный Вход': ['Центральная площадь'],
        'Магазин Березка': ['Центральная площадь'],
        'Портал': ['Центральная площадь'],
        'Банк': ['Центральная площадь'],
        'Страшилкина улица': ['Центральная площадь', 'Цветочный магазин', 'Казино', 'Храм', 'Зоомагазин', 'Большая скамейка', 'Средняя скамейка', 'Маленькая скамейка'], // 'Общежитие', 
        'Цветочный магазин': ['Страшилкина улица'], 
        'Казино': ['Страшилкина улица'], 
        'Храм': ['Страшилкина улица'], 
        'Зоомагазин': ['Страшилкина улица'], 
        'Большая скамейка': ['Страшилкина улица'], 
        'Средняя скамейка': ['Страшилкина улица'], 
        'Маленькая скамейка': ['Страшилкина улица']
      }
    },
    toString: function() {
      return 'Перемещение в заданную локацию';
    },
    getProperties: function() {
      this.city = top.location.host.replace(/\..*$/,'');
      if (!(this.city in this.pathes))
        return 'В этом городе не заданы маршруты';

      var locations_count = 0;
      var locations_list = [];
      for(var location in this.pathes[this.city]) {
        locations_list.push(location);
      }
      locations_list.selected = 0;
      return [
        { name:"Куда бежим:",
          value: locations_list
        },
        { name:"Побежали!", value:this.run_to_location }
      ];
    },
    analyze_step: function(new_step, from) {
      if (!(from in this.steps))
        this.steps[from] = {};
      for(var next in this.pathes[this.city][from]) {
        var next_name = this.pathes[this.city][from][next];
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
      } else {
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
          combats_plugins_manager.add_chat('<font class=date2>'+(new Date().toLocleTimeString())+'</font> <i>Не удалось перемещение в "'+this.new_location+'" за '+this.attempts_limit+' попыток</i>')
          return;
        }
        setTimeout(
          combats_plugins_manager.get_binded_method(this, this.try_run_to_new_location),
          2000);
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
          1000);
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
      try {
        this.step = 0;
        this.analyze_step(this.step+1, this.current_location);
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
//      this.current_location = 'Магазин';
//      this.city = 'emeraldscity';
      if (!this.mainframeHandler) {
        this.mainframeHandler = combats_plugins_manager.get_binded_method(
          this, this.try_run_to_new_location);
      }
      this.prev_location = '';
      combats_plugins_manager.attachEvent('mainframe.load',
        this.mainframeHandler);
      this.try_run_to_new_location();
    },
    Init: function() {
    }
  }

//  plugin_run_to_location.run_to_location('Храм');
  return plugin_run_to_location;
})()