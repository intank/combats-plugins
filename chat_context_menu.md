После того, как пользователь вызвал контекстное меню персонажа, генерирует событие **fighterContextMenu** без параметров. Пример обработки события контекстного меню:
```
...
    Init: function() {
      top.combats_plugins_manager.attachEvent('fighterContextMenu', 
        top.combats_plugins_manager.get_binded_method(this, this.handlerCtxMenu));
    },
...
    handlerCtxMenu: function(eventObj) {
      if (!this.menuItem) {
        this.menuItem = top.document.createElement('A');
        top.Chat.Self.oCtxMenu.insertBefore(this.menuItem,top.Chat.Self.oCtxMenu.lastChild.previousSibling);
        this.menuItem.className = 'ChatCtxMenu';
        this.menuItem.href = 'javascript:void(0)';
      }
      this.menuItem.onclick = combats_plugins_manager.get_binded_method(this,this.someAction,top.Chat.Self.oCtxMenu.sLogin);
      this.menuItem.innerText = 'Некоторое действие с "'+top.Chat.Self.oCtxMenu.sLogin+'"';
    },
...
    someAction: function(login) {
      top.Chat.Self.CtxMenuHide(); // скрыть меню после клика
      alert(login);
    },
...
```
Поскольку в контекстном меню последний элемент необходим для функционирования действия "COPY", добавлять новые пункты нужно перед последним элементом:
```
        top.Chat.Self.oCtxMenu.insertBefore(this.menuItem,top.Chat.Self.oCtxMenu.lastChild.previousSibling);
```