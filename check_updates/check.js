(function(){
  var actualVersion = '1.5';
  var downloadsURL = 'http://code.google.com/p/combats-plugins/downloads/list/';

  var version = combats_plugins_manager.getVersion();
  var av = actualVersion.split('.');
  var v = version.split('.');
  
  var newVersionFound = false;
  for (var i=0; i<av.length || i<v.length; i++) {
    if (av[i] && v[i] && av[i]>v[i] || !v[i]) {
      newVersionFound = true;
      break;
    }
  }
  if (newVersionFound) {
    combats_plugins_manager.add_chat(':idea: Внимание! Доступна новая версия <b>Менеджера плагинов для БК</b>. Обновить версию можно на <a href="'+downloadsURL+'" title="Google Code">странице загрузок</a>.')
  }
})()