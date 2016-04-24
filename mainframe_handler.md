Отслеживает обновления основного фрейма игровой страницы. При каждом обновлении генерирует событие **mainframe.load**, передавая объект **eventObj** следующего содержания:
```
var eventObj = { 'window': combats_plugins_manager.getMainFrame() };
```
Для подписки на событие достаточно вызвать метод **attachEvent** объекта **combats\_plugins\_manager**:
```
...
  atHouse: false,
  onLoad: function(eventObj) {
    if (eventObj.window.location.pathname=='/house.pl') {
      if (!this.atHouse) { // если мы дома и ещё не отписались, то отпишемся
        this.atHouse = true;
        combats_plugins_manager.add_chat('Мы дома :ura:');
      }
    } else
      this.atHouse = false;
  },
...
  Init: function() {
...
    combats_plugins_manager.attachEvent('mainframe.load', combats_plugins_manager.get_binded_method(this, this.onLoad));
...
  }
...
```