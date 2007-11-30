(function() {
  function plugin_chat_filter() {
    this.Init();
  }

  plugin_chat_filter.prototype = {
    filters: {},
    toString: function() {
      return "Фильтр сообщений";
    },
    Init: function() {
      combats_plugins_manager.attachEvent(
        'onmessage',
        combats_plugins_manager.get_binded_method(this,this.processMessage));
    },
    addFilter: function(filter) {
      var s;
      do {
        s = 'a'+Math.random();
      } while(s in this.filters);
      this.filters[s] = filter;
      return s;
    },
    removeFilter: function(s) {
      if (s in this.filters)
        delete this.filters[s];
    },
    processMessage: function(eventObj) {
      if (eventObj.mess=='')
        return;
      var match;
      for(var i in this.filters) {
        match = eventObj.mess.match(this.filters[i].filter);
        if (match)
          this.filters[i].handler(match,eventObj);
      }
    }
  };

  return new plugin_chat_filter();
})()