Панель кнопок. Плагин, позволяющий другим плагинам системы зарегистрировать кнопку в свободной области игрового окна.

По умолчанию создаваемая кнопка имеет следующие атрибуты:
  * border:0px;
  * margin:0 2px;
  * padding:0px;
  * background-color:transparent;
  * background-repeat:no-repeat;
  * background-position:center;
  * width:16px;
  * height:16px;
  * cursor:hand;
  * overflow:hidden;
  * position:relative;

Пример создания кнопки:
```
top.combats_plugins_manager.plugins_list['top_tray'].addButton({
  'button': {
    'style': {
      'width': "20px",
      'height': "20px",
      'padding': "2px",
      'background': "#505050"
      },
    'onclick': do_something()
    },
  'img': {
    'style': {
      'width': "16px",
      'height': "16px"
      },
    'onmouseout': onmouseout_handler,
    'onmouseover': onmouseover_handler,
    'src': image_url,
    'alt': "Подсказка"
    }
  });
```
В функцию addButton передаётся объект, имеющий следующие свойства:
  * button - объект, задаёт параметры собственно объекта-кнопки
  * img - объект, задаёт параметры картинки, вставленной в кнопку

Смотрите так же [перечень плагинов](PluginsList.md)