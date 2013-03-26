(function(){
  var actualVersion = '1.9.2';
  var downloadsURL = 'http://code.google.com/p/combats-plugins/downloads/list';
  var msgNewVersion = ':idea: Внимание! Доступна новая версия <b>Менеджера плагинов для БК</b>. Обновить версию можно на <a href="'+downloadsURL+'" target=_blank title="Google Code">странице загрузок</a>.';

  var CPM = combats_plugins_manager;
  var version = CPM.getVersion();
  var av = actualVersion.split('.');
  var v = version.split('.');
  
  var newVersionFound = false;
  for (var i=0; i<av.length || i<v.length; i++) {
    if (av[i] && v[i] && parseInt(av[i])>parseInt(v[i]) || !v[i]) {
      CPM.plugins_list['check_updates'].hasUpdate ? CPM.plugins_list['check_updates'].hasUpdate(msgNewVersion) : CPM.add_chat(msgNewVersion);
      return;
    }
  }
  CPM.plugins_list['check_updates'].noUpdates && CPM.plugins_list['check_updates'].noUpdates()
})()