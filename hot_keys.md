# Введение #

В БК практически все действия игрока выполняются только с помощью мыши. Редкое исключение - бой, в котором зона удара и блока может быть задана цифровыми клавишами 1-5, а сам удар выполнен нажатием клавиши Enter.<br /> Данный плагин позволяет отслеживать нажатия клавиш и передавать уведомления прочим плагинам, ожидающим нажатие определённых клавиш или их кмбинаций.

# Использование #

Пример инициализации горячей клавиши. Перед вызовом диалога производится проверка наличия плагина:
```
        var hot_keys = combats_plugins_manager.plugins_list['hot_keys'];
        if (hot_keys)
          hot_keys.setKeyHandler(this.hotKey,
            combats_plugins_manager.get_binded_method(this,this.doSomething),
            this.toString());
        else
          throw new Error('Не загружен требующийся для работы плагин: <b>hot_keys</b>');
```

Собственно, сам обработчик события о нажатии комбинации клавиш:
```
    doSomething: function() {
      alert('Hotkey pressed!');
    },
```

Пример задания горячей клавиши путём вызова диалога. Перед вызовом диалога производится проверка наличия плагина. После закрытия диалога удаляется обработчик уже заданной горячей клавиши и устанавливается новый:
```
    setHotKey: function() {
      var hot_keys = combats_plugins_manager.plugins_list['hot_keys'];
      if (!hot_keys)
        return alert('К сожалению, не найден плагин hot_keys.\nНевозможно задать горячую клавишу.');
      hot_keys.showAssignDialog(
        this.hotKey,
        combats_plugins_manager.get_binded_method(
          this,
          function(result) {
            if (result) {
              if (this.hotKey)
                hot_keys.removeKeyHandler(this.hotKey);
              this.hotKey = result;
              hot_keys.setKeyHandler(this.hotKey, 
                combats_plugins_manager.get_binded_method(this,this.doSomething),
                this.toString());
            }
          })
      );
    },
```