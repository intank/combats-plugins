(function(){
  return {
    toString: function(){
      return 'Исправление зависания боя';
    },
    getProperties: function(){
      return [
        { name: 'Исправить бой', value: this.Fix }
      ];
    },
    Fix: function(){
      try {
        var sURL = top.Battle.oQuery.sURL;
        top.Battle.SetScript(sURL);
        top.Battle.nRequests = 0;
        
      } catch(e) {
        alert('Ошибка');
      }
    },
    Init: function(){
      return this;
    }
  }.Init();
})()