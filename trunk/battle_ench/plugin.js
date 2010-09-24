(function (){
var battle_ench;

function plugin_battle_ench() {
}

plugin_battle_ench.prototype = {
  toString: function() {
    return "Улучшение дизайна боя";
  },
  getProperties: function() {
    return [
      { name:"Отображать уровни бойцов", value: this.enable_warriors_level },
      { name:"Отображать оружие бойцов", value: this.enable_warriors_weapon },
      { name:"Включить кнопку смены противника", value: this.enable_change_button },
      { name:"Сохранять данные о противниках в базу", value: this.autosave }
    ];
  },
  setProperties: function(a) {
    this.enable_warriors_level=a[0].value;
    this.enable_warriors_weapon=a[1].value;
    this.enable_change_button=a[2].value;
    this.autosave=a[3].value;
  },
  saveData: function() {
    this.DataToSave = '';
    this.index = 0;
    setTimeout(combats_plugins_manager.get_binded_method(this, this.saveDataIterate), 10);
  },
  saveDataIterate: function() {
    var warriors_index = this.warriors_index;
    for(var i=0; i<100; i++) {
      if (this.index>=warriors_index.length)
        break;
      s += warriors_index[this.index].warriorName+','+warriors_index[this.index].level+','+warriors_index[this.index].weapon+',\n';
      this.index++; 
    }
    if (this.index>=warriors_index.length) {
      external.writeFile(combats_plugins_manager.security_id,"Combats.RU","battle_ench\\warriors.ini",s);
      this.newData = false;
    } else
      setTimeout(combats_plugins_manager.get_binded_method(this, this.saveDataIterate), 10);
  },
  makeDesignChanges: function(oLayer) {
    this.warriorName = top.Battle.oBattle.sMyLogin;
    this.DisplayWeaponsAndLevels(oLayer);
  },
  onloadHandler: function() {
    if (top.combats_plugins_manager.getMainFrame().location.href.search(/^http\:\/\/\w+\.combats\.(?:com|ru)\/battle\d?\.pl/)!=0) {
      if (this.newData && this.autosave)
        this.saveData();
      return;
    }

    d = top.combats_plugins_manager.getMainFrame().document;
    elements = d.forms["f1"].elements;
    if (this.enable_change_batton && ("f1" in d.forms) && ("let_attack" in elements)) {
      cell = elements["let_attack"].parentNode.nextSibling;
      if (cell!=null && cell.childNodes.length<5) {
        cell.insertBefore(
          d.createElement(
            "<IMG src='http://img.combats.com/i/misc/ico_change.gif' \
              alt=\"Сменить противника (плагин)\" width=16 height=19 \
              onclick=\"findlogin('Смена противника','battle.pl', 'skip', '', '' ,'"+elements["myid"].outerHTML.replace('"','\\"').replace("'","\\'")+"', 1)\" \
              style='cursor:hand'>"),
          cell.firstChild);
      }
    }
    if (this.enable_warriors_level) {
      var s = d.all[0].innerHTML;
      while (match = s.match(/drwfl\("(.*?)",(.*?),"?(.*?)"?,(.*?),"(.*?)"\)/)) {
        if (parseInt(match[2])>1000000) {
          if (!(match[1] in this.warriors)) {
            this.warriors_index[this.warriors_index.length]=this.warriors[match[1]] = new Object();
            this.warriors[match[1]].name = match[1];
            this.warriors[match[1]].level = -1;
            this.warriors[match[1]].weapon = -1;
          }
          if (this.warriors[match[1]].level != match[3]) {
            this.warriors[match[1]].level = match[3];
            this.newData = true;
          }
        }
        s = s.substring(match.lastIndex);
      }
    }
    if (this.enable_warriors_weapon) {
      try {
        var tables = d.getElementsByTagName('table');
        if (tables[0].cells[1].childNodes[0].cells.length==3 && tables[0].cells[1].childNodes[0].rows.length==2) {
          // старый дизайн
          name_cell = tables[0].cells[1].childNodes[0].cells[1];
        } else if (tables[0].cells[1].childNodes[0].cells[0].childNodes[0].rows.length==1 && tables[0].cells[1].childNodes[0].cells[0].childNodes[0].cells.length==3) {
          // новый дизайн
          name_cell = tables[0].cells[1].childNodes[0].cells[0].childNodes[0].cells[2];
        }
        match = name_cell.innerHTML.match(/drwfl\("(.*?)",(.*?),"?(.*?)"?,(.*?),"(.*?)"\)/);
        if (!match)
          throw "Bad info";

        var pers=tables[0].cells[2].childNodes[0].cells[0].childNodes[0].cells[0].childNodes[0].cells[0].childNodes[0];
        var weapon1 = pers.cells[0].childNodes[0].cells[2].childNodes[0].src; // оружие 1
        var weapon2 = pers.cells[2].childNodes[0].cells[4].childNodes[0].src; // оружие 2

  // http://img.combats.com/i/items/w3.gif - нет первого оружия
  // http://img.combats.com/i/items/w10.gif - нет второго оружия
  // http://img.combats.com/i/items/wb.gif - двуручка

        var weapon_type = 0;
        if (weapon2.match(/http\:\/\/img\.combats\.(?:com|ru)\/i\/items\/wb\.gif/))
          weapon_type = 5; // двуручка
        else {
          if (!weapon1.match(/http\:\/\/img\.combats\.(?:com|ru)\/i\/items\/w3\.gif/))
            weapon_type += 1; // пушка
          if (!weapon2.match(/http\:\/\/img\.combats\.(?:com|ru)\/i\/items\/w10\.gif/)) {
            weapon_type += 2; // щит или вторая пушка
            if (weapon2.indexOf('shield')<0)
              weapon_type = 4; // вторая пушка
          }
        }
        if (weapon1.indexOf('staff')>=0)
          weapon_type = 6; // маг
        if (this.warriors[match[1]].weapon != weapon_type) {
          this.warriors[match[1]].weapon = weapon_type;
          this.newData = true;
        }
      } catch (e) {
        if (e!="Bad info")
          top.combats_plugins_manager.logError("battle_ench",e);
      }
    }
    this.DisplayWeaponsAndLevels(d.body);
  },
  DisplayWeaponsAndLevels: function(oLayer) {
    if (this.enable_warriors_level || this.enable_warriors_weapon) {
      var spanList = oLayer.getElementsByTagName('span');
      for (var i=0; i<spanList.length; i++) {
        var className = spanList[i].className;
        if (className!='UserBattleGroup1' && className!='UserBattleGroup0')
          continue;

        var warriorName = spanList[i].innerText;
        if (this.warriorName==warriorName)
          spanList[i].style.color= "#b000b0";
        
        if (warriorName in this.warriors) {
          
          if (this.enable_warriors_weapon && this.warriors[warriorName].weapon>=0) {
            var element = oLayer.document.createElement('<img src="file:///'+combats_plugins_manager.base_folder+'battle_ench/weapon'+this.warriors[warriorName].weapon+'.gif">');
            spanList[i].parentNode.insertBefore(element,spanList[i]);
          }
          if (this.enable_warriors_level) {
            var element = oLayer.document.createTextNode('['+this.warriors[warriorName].level+']');
            spanList[i].parentNode.insertBefore(element,spanList[i].nextSibling);
          }
        }
      }
    }
  },
  disable: function() {
    top.combats_plugins_manager.getMainFrame().frameElement.detachEvent("onload",this.bindedOnloadHandler);
  },
  OnLoadHandler: function( bXML, oXML ) {
    this.originalOnLoad.apply(top.Battle.oBattle.oQuery,[ bXML, oXML ]);
    this.makeDesignChanges(top.Battle.oBattle.oLayer);
  },
  WaitForBattleQueryInit: function() {
    if (typeof(top.Battle.oBattle)!='object') {
      setTimeout(combats_plugins_manager.get_binded_method(this, this.WaitForBattleQueryInit),1000);
      return;
    }
    if ("isManagedByMaxhon" in top.Battle.oBattle.oQuery)
      return;
    top.Battle.oBattle.oQuery.isManagedByMaxhon = true;
    this.originalOnLoad = top.Battle.oBattle.oQuery.OnLoad;
    top.Battle.oBattle.oQuery.OnLoad = combats_plugins_manager.get_binded_method(this, this.OnLoadHandler);
  },
  BattleInit: function( sScript ) {
    this.originalBattleInit.apply( top.Battle, [sScript] );
    this.WaitForBattleQueryInit();
  },
  Unfreeze: function() {
    if (!("oBattle" in top.Battle))
      return;
    top.Battle.oBattle.nRequests = 0;
    top.Battle.oBattle.Send({},0);
  },
  Init: function() {
    this.newData = false;
    this.enable_change_button = true;
    this.autosave = false;
    this.enable_warriors_level = true;
    this.enable_warriors_weapon = false;
    this.warriorName = top.getCookie('battle');

    this.warriors = new Object();
    this.warriors_index = new Array();
    var s = external.readFile(combats_plugins_manager.security_id,"Combats.RU","battle_ench\\warriors.ini");
    if (typeof(s) == 'string') {
      warriors = s.split(/(\n|\r)+/);
      var matches;
      for(var i=0; i<warriors.length; i++)
        if (matches = warriors[i].match(/(.*?),(.*?),(\d*),?.*/)) {
          this.warriors_index[this.warriors_index.length]=this.warriors[matches[1]] = new Object();
          this.warriors[matches[1]].name = matches[1];
          this.warriors[matches[1]].level = matches[2];
          this.warriors[matches[1]].weapon = parseInt(matches[3]?matches[3]:-1);
        }
    }

    var div= top.frames[1].document.body.appendChild(
      top.frames[1].document.createElement(
        '<DIV style="position:absolute; left:288px; top:6px; width:20px; height:20px; cursor:hand; background:#505050" \
          onmouseout="this.children[0].filters.Glow.Enabled=0" \
          onmouseover="this.children[0].filters.Glow.Enabled=1">'));
    div.attachEvent('onclick', combats_plugins_manager.get_binded_method(this, this.Unfreeze));
    div.innerHTML=
        '<IMG src="file:///'+combats_plugins_manager.base_folder+'battle_ench/icon.gif" \
          style="position:absolute; left:2px; top:2px; width:16px; height:16px; filter:Glow(color=#DDDDDD,Strength=3,Enabled=0)" \
          alt="Реанимировать бой">';

    if (typeof(top.Battle.oBattle)=='object') {
      this.WaitForBattleQueryInit();
    } else {
      this.originalBattleInit = top.Battle.Init;
      top.Battle.Init = combats_plugins_manager.get_binded_method(this, this.BattleInit);
    }
//    this.bindedOnloadHandler = combats_plugins_manager.get_binded_method(this, this.onloadHandler);

  }
};
battle_ench = new plugin_battle_ench();
battle_ench.Init();
return battle_ench;
})()