(function(){
  return {
    autoPrompt: true,
    autoMoveItems: {},
    getProperties: function() {
      var items = [];
      for(var i in this.autoMoveItems) {
        items.push(i);
      }
      return [
        { name:"Предлагать переместить автоматически", value:this.autoPrompt },
        { name:"Перечень предметов в списке для переноса", value:items.join('\n'), type:'textarea' }
      ];
    },
    setProperties: function(a) {
      this.autoPrompt = a[0].value;
      this.autoMoveItems = {};
      items = a[1].value.split(/\s*[\n\r;]+\s*/);
      for(var i=0; i<items.length; i++)
        this.autoMoveItems[items[i]] = true;
      this.config.saveIni('autoMoveItems',items.join(';'));
    },
    toString: function() {
      return "Работа с сундуком";
    },
    parseItems: function(innerHTML) {
      var result = [];
      var matches = innerHTML.match(/<A\s+[^>]*?href="[^"]*?&amp;(?:to_box|from_box)=(\d+)[^"]*"[^>]*>(?:В инвентарь|В сундук)<\/A>[\s\S]*?<A\s+[^>]*?HREF="\/encicl\/object\/(.*?)\.html"[^>]*?>([^<]+?)(?:\s+\(x(\d+)\)|)<\/A>/ig);
      for(var i=0; i<matches.length; i++) {
        matches[i] = matches[i].match(/<A\s+[^>]*?href="[^"]*?&amp;(?:to_box|from_box)=(\d+)[^"]*"[^>]*>(?:В инвентарь|В сундук)<\/A>[\s\S]*?<A\s+[^>]*?HREF="\/encicl\/object\/(.*?)\.html"[^>]*?>([^<]+?)(?:\s+\(x(\d+)\)|)<\/A>/i);
        if (!matches[i])
          continue;
        result.push({
          img: matches[i][2],
          name: matches[i][3],
          count: parseInt(matches[i][4]) || 1,
          index: parseInt(matches[i][1])
        });
      }
      return result;
    },
    refreshChest: function() {
      top.frames[3].location='/house.pl?room=2&'+Math.random();
    },
    checkItemMoved: function() {
      if (this.AJAX.readyState != 4)
        return;
      if (this.AJAX.status!=200) {
        combats_plugins_manager.add_chat('Ошибка сервера при перекладывании предметов из инвентаря в сундук');
        this.refreshChest();
        return;
      }
      var responseText = this.AJAX.responseText;
      var match = responseText.match(/<FONT COLOR=red><B>(Предмет ".*?" перенесен из инвентаря|)([^<]*?)</i);
      if (match) {
        combats_plugins_manager.add_chat('<i>'+(match[1] || match[2])+'</i>');
        if (match[1])
          setTimeout(combats_plugins_manager.get_binded_method(this,this.moveNextItem),10);
        else
          this.refreshChest();
        return;
      }
      combats_plugins_manager.add_chat('Не определён результат перекладывания предметов из инвентаря в сундук');
      this.refreshChest();
    },
    moveNextItem: function() {
      if (this.itemsToMove.length>0) {
        if (this.currentItem) { // уменьшаем индекс предметов, лежащих ниже
          for(var i in this.itemsToMove)
            if (this.itemsToMove[i].index>this.currentItem.index)
              this.itemsToMove[i].index--;
        }
        this.currentItem = this.itemsToMove.pop();

        this.AJAX = combats_plugins_manager.getHTTPRequest();
        this.AJAX.onreadystatechange = 
          combats_plugins_manager.get_binded_method(this,this.checkItemMoved);

        this.AJAX.open('GET','/house.pl?room=2&from_box='+this.currentItem.index+'&sd4='+this.sd4+'&'+Math.random());
        this.AJAX.send('');
      } else {
        combats_plugins_manager.add_chat(':ura: Перекладывание завершено');
        this.refreshChest();
      }
    },
    moveSelected: function() {
      this.window.oWindow.Hide();
      for(var i=this.itemsToMove.length-1; i>=0; i--)
        if (!top.document.getElementById('move_to_chest_check'+i).checked) {
          this.itemsToMove.splice(i,1);
        }
      this.currentItem = null;
      this.moveNextItem();
    },
    analizeChest: function(window) {
      var d = window.document;
      var match = d.body.innerHTML.match(/Сундук\:\s*(\d+)\s*\/\s*(\d+),\s*передач\:\s*(\d+)/);
      if (!match)
        return;
      var params = {
        used: parseInt(match[1]),
        max: parseInt(match[2]),
        exchangeLimit: parseInt(match[3])
      };
      var tables = window.document.getElementsByTagName('TABLE');
      var tableChest = tables[3];
      var tableInventory = tables[4];

//      var itemsChest = this.parseItems(tableChest.innerHTML);
      var itemsInventory = this.parseItems(tableInventory.innerHTML);

      var autoMoveItems = [];
      for(var i in itemsInventory) {
        if (this.autoMoveItems[itemsInventory[i].name]) {
          autoMoveItems.push(itemsInventory[i]);
        }
      }

      if (autoMoveItems.length>0) {
        this.sd4 = window.sd4;
        this.itemsToMove = autoMoveItems;
        if (!this.window) {
          this.window = combats_plugins_manager.createWindow("Скинуть в сундук", 320, 480);
        }
        var s = '';
        for(var i in autoMoveItems) {
          s += '<tr><td style="width:100%; height: 1em; padding:2px 10px; cursor: pointer; font-weight: bold; vertical-align: middle"><input id="move_to_chest_check'+i+'" style="float:right; cursor:default; vertical-align: middle; height:100%; border: 0" type="checkbox" CHECKED /><img src="http://img.combats.com/i/items/'+autoMoveItems[i].img+'.gif" alt="" style="vertical-align: middle"/>'+autoMoveItems[i].name+'('+autoMoveItems[i].count+')</td></tr>';
        }
        var div = document.createElement('<div style="width:100%; height:100%; overflow-y:scroll">');
        div.innerHTML = '<button>Переместить выделенное</button><table style="width: 100%">'+s+'</table>';
        this.window.oWindow.Insert(div);
        div.firstChild.onclick=combats_plugins_manager.get_binded_method(this, this.moveSelected);
        this.window.oWindow.Show();
      }
    },
    mainframeLoad: function(eventObj) {
      if (eventObj.window.location.pathname!='/house.pl' 
          || !eventObj.window.location.search.match(/(\?|&)room=2(&|$)/)) 
        return;
      if (this.autoPrompt)
        this.analizeChest(eventObj.window);
      else {
        var button = eventObj.window.document.createElement('BUTTON');
        button.innerText = "Автоматический перенос предметов";
        button.onclick = 
          combats_plugins_manager.get_binded_method(this,this.analizeChest,eventObj.window);
        eventObj.window.document.body.insertBefore(
          button,eventObj.window.document.body.firstChild);
      }
    },
    Init: function() {
      this.config = combats_plugins_manager.createConfigurationElement('chest_operations');
      this.autoPrompt = (this.config.loadIni('autoPrompt','true')!='false');
      var items=this.config.loadIni('autoMoveItems','Лучистый рубин;Лучистый топаз;Кристалл голоса предков;Камень затаенного солнца;Кристалл стабильности;Шепот гор;Эссенция глубины;Эссенция лунного света;Эссенция праведного гнева;Эссенция чистоты;Стихиалия;Ралиэль').split(/;/);
      for(var i=0; i<items.length; i++)
        this.autoMoveItems[items[i]] = true;

      combats_plugins_manager.attachEvent(
        'mainframe.load',
        combats_plugins_manager.get_binded_method(this,this.mainframeLoad));
      return this;
    }
  }.Init();
})()