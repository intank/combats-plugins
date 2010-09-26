(function (){
  return {
    filters: [
    ],
    filter:'',
    transactionItem: null,
    'debugger': false,
    transaction: {},
    sender: null,
    cancelTimer: 0,
    toString: function() {
      return "Фильтр в передачах";
    },
    getProperties: function() {
      return [
        { name:"Фильтры", value:this.getFilters(), type:'textarea', style:'overflow-x:scroll' }
      ];
    },
    getFilters: function() {
      var s = external.readFile(combats_plugins_manager.security_id,"Combats.RU","exchange_filter\\filters.ini");
      while (s && !s.slice(-1).charCodeAt(0)) {
        s = s.slice(0,-1);
      }
      return s?s:'';
    },
    loadFilters: function() {
      this.filters = [];
      var s = this.getFilters();
      if (s) {
        var filters = s.split(/(\n|\r)+/);
        var match;
        for(var i=0; i<filters.length; i++)
          if (match = filters[i].match(/^\s*([\d\.]+)\s*,\s*(.*?)\s*,\s*\(\s*(.*?)\s*\)(?:\s*,\s*(.+)\s*)?$/)) {
          }
      }
    },
    enQuoteText: function(s) {
      return s.replace(/(\\n)/g,'\\\\n').replace(/\s*[\n\r]+\s*/g,'\\n');
    },
    deQuoteText: function(s) {
      return s.replace(/(^|[^\\])\\n/g,'$1\n').replace(/(\\\\n)/g,'\\n');
    },
    setProperties: function(a) {
      external.writeFile(combats_plugins_manager.security_id,"Combats.RU","exchange_filter\\filters.ini",a[0].value);
      this.loadFilters();
    },
    getTransactionObject: function() {
      return top.frames[0].Libraries['User.Exchange.Transaction'].oWindow.Self;
    },
    showPrompt: function() {
      return top.Window.Prompt(this.filterItems, this, 'Введите фразу, по которой будет сделана фильтрация предметов', this.filter, 'Фильтр');
    },
    filterItems: function(filter) {
      try {
        this.filter = filter;
        var transactionObject = this.getTransactionObject();
        var items = transactionObject.oBox.arrItems;

        for(var i in items) {
          items[i].style.display = items[i].innerText.indexOf(filter)<0 ? 'none' : '';
        }
      } catch (ex) {
      }
    },
    transferHandler: function(eventObj) {
      if (!this.transaction)
        return;
      if (this['debugger'])
        debugger;
      if ('credit' in eventObj)
        this.transaction.credits = parseFloat(eventObj.credit);
      if ('action' in eventObj) {
        if (eventObj.action=='noaccept') {
          this.transaction.ready = false;
        } else if (eventObj.action=='tomybox' && this.transactionItem) {
          if (this.transactionItem.unload==this.transactionItem.amount) {
            this.transactionItem.complete = true;
          } else if (!this.unload()) {
            var discountInfo = '';
            this.transactionItem = null;
            this.transaction = null;
          }
        }
      }
    },
    Init: function() {
      this.loadFilters();

      var top_tray = combats_plugins_manager.plugins_list['top_tray'];
      if (top_tray) {
        this.button = top_tray.addButton({
          'button': {
            'style': {
              'width': "40px",
              'height': "20px",
              'padding': "0",
              'border': "1px outset",
              'background': "#707070"
              },
            'onclick': top.combats_plugins_manager.get_binded_method(this, 
              function() {
                this.showPrompt(true);
              })
            },
          'img': {
            'style': {
              'width': "37px",
              'height': "16px"
              },
            'src': "file:///"+combats_plugins_manager.base_folder+"exchange_filter/icon.png",
            'alt': "Фильтровать предметы"
            }
          });
      }
      return this;
    }
  }.Init();
})()