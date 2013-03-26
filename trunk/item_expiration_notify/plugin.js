(function() {
  var CPM = top.combats_plugins_manager;
  return {
    toString: function() {
      return "Уведомление об истечении срока годности";
    },
    notify_handler: null,
    getProperties: function() {
      return [
        { name: "Перечень контролируемых предметов", value: this.items.join('\n'), type: 'textarea' }
      ];
    },
    setProperties: function(a, noSave) {
      this.items = a[0].value.split(/\s*[\n\r]+\s*/);
      this.configurator.saveIni('items',this.items.join(';'));
    },
    onloadHandler: function() {
      var mainframe = CPM.getMainFrame();
      if (mainframe.location.pathname.search(/^\/main\.pl/)!=0)
        return;
      if (!this.notify_handler)
        this.notify_handler = CPM.plugins_list['notify_handler'];
      var self = this;
      setTimeout(function(){
        var $ = top.$;
        try {
//          var result = '';
          var href = $('td[bgcolor=#a5a5a5] a',mainframe.document.body).attr('href');
          var section = ((href?href.match(/[\?&]edit=(\d+)(?=&|$)/):0)||[])[1];
          if (!section)
            return;
          section = 'inventory_expiration_'+section;
          var now = parseInt((new Date()).getTime()/60000);
          self.notify_handler.clear_notifications(section);
          $('table[bgcolor]:has(>tbody>tr[bgcolor]) > tbody > tr',mainframe.document).each(function(){
            var match = $('>td:eq(1)',this).text().match(/Срок годности\:.*?\(до (\d+)\.(\d+)\.(\d+)\s+(\d+)\:(\d+)\)/);
            if (match) {
              var itemTitle = $($('> td:last-child > a:first-child',this)[0].firstChild).text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g,'');
              if ($.inArray(itemTitle,self.items)<0)
                return;
              var expiration = new Date(
                parseInt(match[3])<100?parseInt(match[3])+2000:parseInt(match[3]),
                parseInt(match[2])-1,
                parseInt(match[1]),
                parseInt(match[4]),
                parseInt(match[5]),
                0,0
              );
//              var notificationID = expiration.valueOf()+itemTitle;
//              result += itemTitle+expiration.toLocaleString()+'\n';
              expiration = Math.floor(expiration.valueOf()/60000);
              self.notify_handler.add_notification(section,'Срок годности предмета '+itemTitle,expiration);
            }
          });
//          result && alert(result);
        } catch (e) {
          CPM.logError(self,e);
        }
      },50);
    },
    init: function(){
      this.configurator = CPM.createConfigurationElement('item_expiration_notify');
      this.items = this.configurator.loadIni('items', '').split(/;/);
      CPM.attachEvent(
        'mainframe.load',
        CPM.get_binded_method(this,this.onloadHandler));
      return this;
    }
  }.init();
})()
