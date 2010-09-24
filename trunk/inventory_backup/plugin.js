(function (){

  // This code was written by Tyler Akins and has been placed in the
  // public domain.  It would be nice if you left this header intact.
  // Base64 code from Tyler Akins -- http://rumkin.com

  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  var encode64 = function (input) {
     var output = "";
     var chr1, chr2, chr3;
     var enc1, enc2, enc3, enc4;
     var i = 0;

     do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
           enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
           enc4 = 64;
        }

        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
           keyStr.charAt(enc3) + keyStr.charAt(enc4);
     } while (i < input.length);
     
     return output;
  }

  var decode64 = function(input) {
     var output = "";
     var chr1, chr2, chr3;
     var enc1, enc2, enc3, enc4;
     var i = 0;

     // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
     input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

     do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
        }
     } while (i < input.length);

     return output;
  }

  // base64 functions end ------------

  var inventory_backup = function() {
    this.autoSaveChest = ('true'==this.load('autoSaveChest',''));
    this.addChestToInventory = ('true'==this.load('addChestToInventory',''));
    top.combats_plugins_manager.attachEvent(
      'mainframe.load',
      top.combats_plugins_manager.get_binded_method(this,this.onloadHandler));
  };

  inventory_backup.prototype = {
    oReq: null,
    addChestToInventory: false,
    autoSaveChest: false,
    toString: function() {
      return "Резервное сохранение инвентаря";
    },
    load: function(key,def_val){
      return external.m2_readIni(combats_plugins_manager.security_id,"Combats.RU","inventory_backup\\inventory_backup.ini",top.getCookie('battle'),key,def_val);
    },
    save: function(key,val){
      external.m2_writeIni(combats_plugins_manager.security_id,"Combats.RU","inventory_backup\\inventory_backup.ini",top.getCookie('battle'),key,val);
    },
    getProperties: function() {
      return [
        { name: 'Автоматически делать снимок сундука', value: this.autoSaveChest },
        { name: 'Добавлять снимок сундука в инвентарь', value: this.addChestToInventory },
        { name: "Сохранить снимок инвентаря", value: this.SaveSnapshot }
      ];
    },
    setProperties: function(a) {
      this.autoSaveChest = a[0].value;
      this.addChestToInventory = a[1].value;
      this.save('autoSaveChest',this.autoSaveChest.toString());
      this.save('addChestToInventory',this.addChestToInventory.toString());
    },
    onloadHandler: function(eventObj) {
      if (this.addChestToInventory && top.combats_plugins_manager.getMainFrame().location.pathname=='/main.pl' && top.combats_plugins_manager.getMainFrame().location.search.search(/(?:\?|&)(?:edit|skmp|set|setdown)=/)>=0) {
        var tabsTable;
        try {
          tabsTable = top.combats_plugins_manager.getMainFrame().document.
            getElementsByTagName('TABLE')[0].cells[1].
            getElementsByTagName('TABLE')[0].cells[0].
            getElementsByTagName('TABLE')[0];
        } catch(e) {
          return;
        }
        var ChestTabCell = tabsTable.rows[0].insertCell();
        ChestTabCell.align='center';
        ChestTabCell.innerHTML = '<a href=#>Сундук</a>';
        ChestTabCell.firstChild.onclick = 
          top.combats_plugins_manager.get_binded_method(this,this.onChestTabClick);
      } else if (top.combats_plugins_manager.getMainFrame().location.pathname=='/house.pl' && top.combats_plugins_manager.getMainFrame().location.search.search(/(?:\?|&)room=2/)>=0) {
        if (this.autoSaveChest) {
          this.saveChest();
        } else {
          var document = top.combats_plugins_manager.getMainFrame().document;
          var saveChestButton = document.createElement('BUTTON');
          saveChestButton.innerText = 'Сохранить снимок сундука';
          saveChestButton.onclick = 
            top.combats_plugins_manager.get_binded_method(this,this.onSaveChestClick);
          document.body.insertBefore(saveChestButton, document.body.firstChild);
        }
      }
    },
    saveChest: function() {
      var document = top.combats_plugins_manager.getMainFrame().document;
      var chestHTML = document.getElementsByTagName('TABLE')[2].rows[1].cells[0].getElementsByTagName('TABLE')[0].outerHTML;
      external.writeFile(combats_plugins_manager.security_id,"Combats.RU","inventory_backup\\"+top.getCookie('battle')+".chest.xml",chestHTML);
    },
    onSaveChestClick: function() {
      saveChest();
      alert('Сохранено.');
    },
    onChestTabClick: function() {
      var inventoryCell;
      try {
        inventoryCell = top.combats_plugins_manager.getMainFrame().document.
          getElementsByTagName('TABLE')[0].cells[1].
          getElementsByTagName('TABLE')[0].rows[2].cells[0]; // .getElementsByTagName('TABLE')[0];
      } catch(e) {
        return;
      }
      var chestHTML = external.readFile(combats_plugins_manager.security_id,"Combats.RU","inventory_backup\\"+top.getCookie('battle')+".chest.xml");
      if (!chestHTML)
        chestHTML = '';
      inventoryCell.innerHTML = chestHTML;
      var tabsTable;
      try {
        tabsTable = top.combats_plugins_manager.getMainFrame().document.
          getElementsByTagName('TABLE')[0].cells[1].
          getElementsByTagName('TABLE')[0].cells[0].
          getElementsByTagName('TABLE')[0];
      } catch(e) {
        return;
      }
      for(var i=0; i<tabsTable.cells.length; i++)
        tabsTable.cells[i].bgColor = '';
      tabsTable.cells[tabsTable.cells.length-1].bgColor = '#A5A5A5';
    },
    getPart: function(data, URL) {
/*
      base64text = encode64(base64text);
      base64text = decode64(base64text);
      var i=0;
      var l=base64text.length;
      var s='';
      while (i<l) {
        s += base64text.substr(i,76)+'\n';
        i+=76;
      }
      base64text=s;
*/
      
      var result = '--'+this.boundary+'\nContent-Type: text/html;\n	charset="windows-1251"\n';
      if (false) {
        result += 'Content-Transfer-Encoding: base64\n';
      }
      if (URL) {
        result += 'Content-Location: '+URL+'\n';
      }

      return result+'\n'+data+'\n\n';
    },
    SaveSnapshot: function(a) {
      if (this.oReq == null) {
        if (top.XMLHttpRequest) {
          this.oReq = new top.XMLHttpRequest();
        } else if (window.ActiveXObject) {
          this.oReq = new ActiveXObject("Microsoft.XMLHTTP");
        } else
          return;
      }

      var date = new Date();
      this.boundary = '----=_NextPart_'+(date.getTime()+Math.random());/000_0000_01C4EB29.617D3AC0/

      var content = 'From: <Сохранено плагином inventory_backup>\n\
Subject: =?koi8-r?B?'+encode64('Копия инвентаря')+'?=\n\
Date: '+date.toGMTString()+'\n\
MIME-Version: 1.0\n\
Content-Type: multipart/related;\n\
	type="text/html";\n\
	boundary="'+this.boundary+'"\n\
X-MimeOLE: Produced By Microsoft MimeOLE V6.00.2800.1106\n\
\n\
This is a multi-part message in MIME format.\n\
\n\
';

      var container = external.readFile(top.combats_plugins_manager.security_id,'Combats.RU','inventory_backup/container.html');
      content += this.getPart(container);

      for (var page=1; page<=4; page++) {
        this.oReq.open('GET','http://'+top.location.host+'/main.pl?edit='+page+'&'+Math.random(),false);
        this.oReq.send();
        content += this.getPart(this.oReq.responseText, '/main.pl?edit='+page);
      }

      this.oReq.open('GET','http://'+top.location.host+'/house.pl?room=2&'+Math.random(),false);
      this.oReq.send();
      
      var house = this.oReq.responseText;
      if (house.indexOf('Состояние: <B>Вы спите</B>')>=0) {
        alert('Для сохранения содержимого сундука необходимо проснуться.\n\nСундук не сохранён!');
        content += this.getPart('', '/house.pl?room=2');
      } else
        content += this.getPart(house, '/house.pl?room=2');


      content += '--'+this.boundary+'--\n';

      external.writeFile(top.combats_plugins_manager.security_id,'Combats.RU','inventory_backup/'+top.getCookie('battle')+/*'.'+date.toLocaleString()+*/'.mht',content);

      alert("Выполнено");
    }
  };

  return new inventory_backup();
})()