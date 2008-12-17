(function (){
  return {
    minLevel: 8,
    injuried: false,
    claner: false,
    filterButton: true,
    toString: function() {
      return "Фильтрация списка on-line";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","online_filter\\online_filter.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","online_filter\\online_filter.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      return [
        { name: "Минимальный уровень", value: this.minLevel },
        { name: "Только травмированных", value: this.injuried },
        { name: "Только клановых", value: this.claner },
        { name: "Отображать кнопку быстрого фильтра", value: this.filterButton }
      ];
    },
    doFilter: function() {
      var itemsParent = top.frames['activeusers'].document.body.childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[2];
      var items=itemsParent.childNodes;
      var rowStart = null;
      var charOK;
      var isClaner;
      var injured;
      var level;
      var base;
      var match;
      var i=0;
      while(i<items.length) {
        obj = items[i];
        if (obj.nodeName=='A') { // ссылка
          if (obj.href.match(/^javascript\:top\.AddToPrivate\(.*?\)/)) {
            base = i;
            rowStart = obj;
            isClaner = false;
            injured = false;
            level = 0;
          } else if (obj.href.match(/^http\:\/\/capitalcity\.combats\.(?:com|ru)\/encicl\/klan\//)) {
            isClaner = true;
          }
        } else if (obj.nodeName=='#text') {
          match = obj.nodeValue.match(/\[(\d+)\]/);
          if (match) {
            level = parseInt(match[1]);
          }
        } else if (obj.nodeName=='IMG') {
          if (obj.src.match(/http\:\/\/img\.combats\.(?:com|ru)\/i\/travma2\.gif/))
            injured = true;
        } else if (obj.nodeName=='BR') {
          if (level<this.minLevel || this.injuried && !injured || this.claner && !isClaner) {
            if (rowStart) {
              while (i>=base) {
                itemsParent.removeChild(items[i]);
                i--;
              }
            }
            rowStart = null;
          }
        }
        i++;
      }
    },
    filterButtonShowHide: function() {
      var buttonElement = top.frames['activeusers'].document.getElementById('filter_button');
      if (this.filterButton) {
        if (!buttonElement) {
          var button = top.frames['activeusers'].document.createElement('<INPUT type=button id="filter_button" value="Фильтр">')
          top.frames['activeusers'].document.body.childNodes[0].appendChild(button).onclick = top.combats_plugins_manager.get_binded_method(this,this.doFilter);
        }
      } else {
        if (buttonElement) {
          buttonElement.parentNode.removeChild(buttonElement);
        }
      }
    },
    setProperties: function(a) {
      this.minLevel=parseInt(a[0].value);
      this.injuried=a[1].value;
      this.claner=a[2].value;
      this.filterButton=a[3].value;
      this.save("minLevel",this.minLevel.toString());
      this.save("injuried",this.injuried.toString());
      this.save("claner",this.claner.toString());
      this.save("filterButton",this.filterButton.toString());

      this.filterButtonShowHide();
      this.doFilter();
    },
    Init: function() {
      this.minLevel = parseInt(this.load("minLevel", '8'));
      this.injuried = this.load("injuried", 'false')=='false'?false:true;
      this.claner = this.load("claner", 'false')=='false'?false:true;
      this.filterButton = this.load("filterButton", 'true')=='true'?true:false;
      this.filterButtonShowHide();
      return this;
    }
  }.Init();
})()