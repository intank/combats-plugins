function plugin_fiz_filter() {
  this.level='2';
  this.toString = function() {
    return "Фильтрация соперников по уровню";
  }
}

plugin_fiz_filter.prototype.getProperties = function() {
  return [
    { name:"Допустимый уровень противника", value: this.level }
  ];
}

plugin_fiz_filter.prototype.setProperties = function(a) {
  this.level=a[0].value;
}

plugin_fiz_filter.prototype.onloadHandler = function() {
  if (top.combats_plugins_manager.getMainFrame().location.href.search(/^http\:\/\/\w+\.combats\.(?:com|ru)\/zayavka\.pl\?level=fiz/)!=0)
    return;
  try {
    var d=top.combats_plugins_manager.getMainFrame().document;
    if (!('F1' in d.forms))
      return;
    enemy = d.forms['F1'].getElementsByTagName('TABLE')[0].cells[0].innerHTML.match(/<SCRIPT>drwfl\(".+?",\d+,"(\d+?)",.+?,".*?"\)<\/SCRIPT>/);
    if (enemy!=null && enemy[1]!=fiz_filter.level)
      d.forms['F1'].elements['close'].click();
  } catch (e) {
    combats_plugins_manager.logError(this,e);
  }
}

fiz_filter = new plugin_fiz_filter();
top.combats_plugins_manager.getMainFrame().frameElement.attachEvent("onload",function(){fiz_filter.onloadHandler();});
fiz_filter