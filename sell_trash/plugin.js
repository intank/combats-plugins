(function(){
  return {
    sd4: top.sd4,
    autoPrompt: true,
    autoMoveItems: {},
    getProperties: function() {
      var items = [];
      for(var i in this.autoMoveItems) {
        items.push(i);
      }
      return [
        { name:"Предлагать продавать автоматически", value:this.autoPrompt },
        { name:"Перечень предметов в списке для продажи", value:items.join('\n'), type:'textarea' }
      ];
    },
    setProperties: function(a) {
      this.autoPrompt = a[0].value;

      items = a[1].value.split(/\s*[\n\r;]+\s*/);
      this.autoMoveItems = {};
      for(var i=0; i<items.length; i++)
        this.autoMoveItems[items[i]] = true;

      this.config.saveIni('autoPrompt',this.autoPrompt.toString());
      this.config.saveIni('autoMoveItems',items.join(';'));
    },
    toString: function() {
      return "Продажа хлама в гос";
    },
    addChat: function(s) {
      combats_plugins_manager.add_chat(s);
    },
    parseItems: function(innerHTML) {
      var result = [];
                                     
      var matches = innerHTML.match(/<TD[^>]*?>[\s\n\r]*?(?:<span\s*[^>]*>|)<IMG [^>]*?SRC="[^"]*?\/items\/([^"]*?)\.gif"[^>]*?>[\s\n\r]*?(?:<small\s*[^>]*><B>x\d+<\/B><\/small><\/SPAN>[\s\n\r]*?|)<BR><a href="(shop.pl\?sl=[^"]*?)">продать за .*? кр.<\/a><\/TD>[\s\n\r]*<TD[^>]*><A HREF="\/encicl\/object\/.*?\.html"[^>]*>([^<]+?)(?:\s*\(x\d+\)|)<\/a>/ig);
      for(var i=0; i<matches.length; i++) {
        matches[i] = matches[i].match(/<TD[^>]*?>[\s\n\r]*?(?:<span\s*[^>]*>|)<IMG [^>]*?SRC="[^"]*?\/items\/([^"]*?)\.gif"[^>]*?>[\s\n\r]*?(?:<small\s*[^>]*><B>x(\d+)<\/B><\/small><\/SPAN>[\s\n\r]*?|)<BR><a href="(shop.pl\?sl=[^"]*?)">продать за .*? кр.<\/a><\/TD>[\s\n\r]*<TD[^>]*><A HREF="\/encicl\/object\/.*?\.html"[^>]*>([^<]+?)(?:\s*\(x\d+\)|)<\/a>/i);
        if (!matches[i])
          continue;
        if (matches[i][3].indexOf(matches[i][1])>=0) {
          result.push({
            img: matches[i][1],
            name: matches[i][4],
            link: matches[i][3].replace(/&amp;/g, '&'),
            count: (matches[i][2] || 1)
          });
        }
      }
      return result;
    },
    refreshShop: function() {
      top.combats_plugins_manager.getMainFrame().location='/shop.pl?sale=&sd4='+this.sd4+'&'+Math.random();
    },
    checkItemMoved: function() {
      if (this.AJAX.readyState != 4)
        return;
      if (this.AJAX.status!=200) {
        this.addChat('Ошибка сервера при продаже предметов');
        this.autoSellComplete = true;
        this.refreshShop();
        return;
      }
      var responseText = this.AJAX.responseText;
      var match = responseText.match(/<FONT COLOR=red><B>(Вы продали "[^"]*?" за [^<]*? кр\.|)([^<]*?)</i);
      if (match) {
        this.addChat('<i>'+(match[1] || match[2])+'</i>');
        if (match[1])
          setTimeout(combats_plugins_manager.get_binded_method(this,this.moveNextItem),10);
        else {
          this.autoSellComplete = true;
          this.refreshShop();
        }
        return;
      }
      this.autoSellComplete = true;
      this.addChat('Не определён результат продажи предметов');
      this.refreshShop();
    },
    moveNextItem: function() {
      if (this.itemsToMove.length>0) {
        this.currentItem = this.itemsToMove.pop();

        this.AJAX = combats_plugins_manager.getHTTPRequest();
        this.AJAX.onreadystatechange = 
          combats_plugins_manager.get_binded_method(this,this.checkItemMoved);

        this.AJAX.open('GET',this.currentItem.link, true);
        this.AJAX.send('');
      } else {
        this.autoSellComplete = true;
        this.addChat(':ura: Сдача в гос завершена');
        this.refreshShop();
      }
    },
    moveSelected: function(auto) {
      if (!auto && this.window) this.window.oWindow.Hide();
      for(var i=this.itemsToMove.length-1; i>=0; i--)
        if (!auto && !top.document.getElementById('sell_to_shop_check'+i).checked) {
          this.itemsToMove.splice(i,1);
        }
      this.currentItem = null;
      this.moveNextItem();
    },
    analizeChest: function(innerHTML, auto) {
      var match = innerHTML.match(/<B>Отдел "Скупка"<\/B>/);
      if (!match) {
        if (auto) this.autoSellComplete = true;
        return;
      }
      var params = {
        used: parseInt(match[1]),
        max: parseInt(match[2]),
        exchangeLimit: parseInt(match[3])
      };

      var itemsInventory = this.parseItems(innerHTML);

      var autoMoveItems = [];
      for(var i in itemsInventory) {
        if (this.autoMoveItems[itemsInventory[i].name]) {
          autoMoveItems.push(itemsInventory[i]);
        }
      }

      if (autoMoveItems.length>0) {
        this.itemsToMove = autoMoveItems;
        if (!auto) {
          if (!this.window) {
            this.window = combats_plugins_manager.createWindow("Продать вещи", 320, 480);
          }
          var s = '';
          for(var i in autoMoveItems) {
            s += '<tr><td style="width:100%; height: 1em; padding:2px 10px; cursor: pointer; font-weight: bold; vertical-align: middle"><input id="sell_to_shop_check'+i+'" style="float:right; cursor:default; vertical-align: middle; height:100%; border: 0" type="checkbox" CHECKED /><img src="http://img.combats.com/i/items/'+autoMoveItems[i].img+'.gif" alt="" style="vertical-align: middle"/>'+autoMoveItems[i].name+'('+autoMoveItems[i].count+')</td></tr>';
          }
          var div = document.createElement('<div style="width:100%; height:100%; overflow-y:scroll">');
          div.innerHTML = '<button>Продать выделенное</button><table style="width: 100%">'+s+'</table>';
          this.window.oWindow.Insert(div);
          div.firstChild.onclick=combats_plugins_manager.get_binded_method(this, this.moveSelected, false);
          this.window.oWindow.Show();
        } else {
          this.moveSelected(true);
        }
      } else {
        this.autoSellComplete = true;
      }
    },
    autoSell: function() {
      this.autoSellComplete = false;
      var counter = 0;
      var requestProcessor = combats_plugins_manager.getHTTPRequestProcessor();
      requestProcessor.onComplete = combats_plugins_manager.get_binded_method(
        this,
        function(AJAX) {
          try {
            this.analizeChest(AJAX.responseText, true);
          } catch(e) {
            combats_plugins_manager.logError(this, e);
            this.autoSellComplete = true;
          }
        });
      requestProcessor.onBadStatus = 
      requestProcessor.onTimeout = combats_plugins_manager.get_binded_method(
        this,
        function() {
          try {
            // перезапустить
            if (counter++<5)
              requestProcessor.GET('/shop.pl?sd4='+this.sd4+'&sale='+Math.random());
            else
              this.autoSellComplete = true;
          } catch(e) {
            combats_plugins_manager.logError(this, e);
            this.autoSellComplete = true;
          }
        });
      requestProcessor.GET('/shop.pl?sd4='+this.sd4+'&sale='+Math.random());
    },
    mainframeLoad: function(eventObj) {
      if (eventObj.window.location.pathname!='/shop.pl' 
          || !eventObj.window.location.search.match(/(\?|&)sale=/)) 
        return;
      if (this.autoPrompt)
        this.analizeChest(eventObj.window.document.documentElement.innerHTML);
      else {
        var button = eventObj.window.document.createElement('BUTTON');
        button.innerText = "Автоматическая продажа предметов";
        button.onclick = 
          combats_plugins_manager.get_binded_method(this,this.analizeChest,eventObj.window.document.documentElement.innerHTML);
        eventObj.window.document.body.insertBefore(
          button,eventObj.window.document.body.firstChild);
      }
    },
    Init: function() {
      this.config = combats_plugins_manager.createConfigurationElement('sell_trash');
      this.autoPrompt = (this.config.loadIni('autoPrompt','true')!='false');
      var items=this.config.loadIni('autoMoveItems','Сгусток астрала;Сгусток эфира;Троекорень;Корень змеиного дерева;Лучистое серебро;Сталь;Железное дерево').split(/;/);
      for(var i=0; i<items.length; i++)
        this.autoMoveItems[items[i]] = true;

      combats_plugins_manager.attachEvent(
        'mainframe.load',
        combats_plugins_manager.get_binded_method(this,this.mainframeLoad));
      return this;
    }
  }.Init();
})()