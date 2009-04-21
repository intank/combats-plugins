(function() {
  return {
    toString: function() {
      return "Деление товара на пачки";
    },

    isUnstack: function(node) {
      if (node.tagName=="A")
        return decodeURI(node.href).match(/javascript\:unstack\('(.*?)',\s*'.*?',\s*'(.*?)\s*\(x(\d+)\)'\)/);
      return null;
    },
    getProperties: function() {
      var Table = this.findBag();
      this.goods = {};
      var goodsArray = [];
      if (Table) {
        for(var i=0; i<Table.rows.length; i++) {
          var children = Table.rows[i].cells[0].children;
          var match;
          if (children[0].tagName=="SPAN" && (match=(this.isUnstack(children[children.length-2]) || this.isUnstack(children[children.length-3])))) {
            if (!(match[1] in this.goods)) {
              this.goods[match[1]] = goodsArray.push(match[2])-1;
            }
          }
        }
      }
      goodsArray.selected = 0;

      return [
        { name:"Разделяемый товар", value: goodsArray },
        { name:"Размер пачки", value: 5 },
        { name:"Начать разделение", value: this.start }
      ];
    },

    findBag: function() {
      var comments = combats_plugins_manager.getMainFrame().document.getElementsByTagName('!');
      for(var i=0; i<comments.length; i++) {
        if (comments[i].outerHTML=="<!--Рюкзак-->") {
          var Table = comments[i].nextSibling;
          while (Table && Table.tagName!="TABLE") {
            Table = Table.nextSibling;
          }
          return Table;
        }
      }
    },

    start: function(a) {
      if (this['debugger']) debugger;
      this.selectedArticle = '';
      for(var i in this.goods) {
        if (this.goods[i]==a[0].value.selected) {
          this.selectedArticle = i;
          break;
        }
      }
      if (this.selectedArticle=='') 
        return alert('Нечего делить');
      this.packSize = parseFloat(a[1].value);
      if (this.packSize<1)
        return alert('Нехорошо делить на 0');

      this.onloadHandlerObject = combats_plugins_manager.get_binded_method(this,this.onloadHandler);
      top.combats_plugins_manager.attachEvent("mainframe.load", this.onloadHandlerObject);
      this.onloadHandler();
//      with (combats_plugins_manager.getMainFrame()) {
//        location=location.href;
//      }
    },

    onloadHandler: function() {
      try {
        var stopFlag = true;
        var Table = this.findBag();
        if (Table) {
          for(var i=0; i<Table.rows.length; i++) {
            var children = Table.rows[i].cells[0].children;
            var match;
            if (children[0].tagName=="SPAN" 
                && (match=(this.isUnstack(children[children.length-2]) || this.isUnstack(children[children.length-3])))
                && match[1]==this.selectedArticle
                && parseFloat(match[3])>this.packSize) {
              var stopFlag = false;
              if (this.isUnstack(children[children.length-2]))
                children[children.length-2].click();
              else if (this.isUnstack(children[children.length-3]))
                children[children.length-3].click();
              setTimeout(
                combats_plugins_manager.get_binded_method(
                  this,
                  function() {
                    var form = combats_plugins_manager.getMainFrame().document.slform;
                    form.quant.value = this.packSize;
                    form.submit();
                  }
                ),
                0
              );
            }
          }
        } else {
          alert('Откройте инвентарь!');
        }
        if (stopFlag) {
          top.combats_plugins_manager.detachEvent("mainframe.load",this.onloadHandlerObject);
        }
      } catch (e) {
        combats_plugins_manager.logError(this,e);
      }
    }
  };
})()