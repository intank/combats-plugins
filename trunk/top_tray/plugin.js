(function() {
  plugin_top_tray = function() {
    this.Init();
  }

  plugin_top_tray.prototype = {
    panel: null,
    buttons: [],
    toString: function() {
      return "Панель кнопок";
    },
    createPanel: function() {
      this.panel = top.document.createElement('DIV');
      this.panel.style.position = 'absolute';
      this.panel.style.left = '190px';
      this.panel.style.top = '6px';
      this.panel.style.height = '20px';
      this.panel.style.width = '500px';
      this.panel.style.overflowX = 'hidden';
      this.panel.style.overflowY = 'hidden';
      top.document.body.insertBefore(this.panel);

      top.document.body.attachEvent(
        'onpropertychange', 
        top.combats_plugins_manager.get_binded_method(this,this.adjustPanelWidth));
      
      this.adjustPanelWidth(true);
    },
    adjustPanelWidth: function(forced) {
      if (forced || window.event.propertyName=='nWidth')
        this.panel.style.width = ''+(top.document.body.offsetWidth-190-500)+'px';
    },
    addButton: function(properties) {
      var button = top.document.createElement('BUTTON');
      var img = top.document.createElement('IMG');
      button.style.cssText =
	'border:0px solid;'+
	'margin:0 2px;'+
	'padding:0px;'+
	'background-color:transparent;'+
	'background-repeat:no-repeat;'+
	'background-position:center;'+
	'width:16px;'+
	'height:16px;'+
	'cursor:hand;'+
	'overflow:hidden;'+
	'position:relative;';
      button.appendChild(img);
      this.panel.insertBefore(button);
      if (properties && typeof(properties)=='object') {
        if ('button' in properties) {
          for(var name in properties['button']) {
            if (name=='style')
              continue;
            button[name]=properties['button'][name];
          }
          if ('style' in properties['button']) {
            for(var name in properties['button']['style']) {
              button.style[name]=properties['button']['style'][name];
            }
          }
        }
        if ('img' in properties) {
          for(var name in properties['img']) {
            if (name=='style')
              continue;
            img[name]=properties['img'][name];
          }
          if ('style' in properties['img']) {
            for(var name in properties['img']['style']) {
              img.style[name]=properties['img']['style'][name];
            }
          }
        }
      }
      
      this.buttons.push(button);
      this.adjustButtons();
      
      return button;
    },
    adjustButtons: function() {
/*
      var offsetLeft = 0;
      for(var i=0; i<this.buttons; i++) {
        this.buttons[i].style.left = ''+offsetLeft+'px';
        offsetLeft += this.buttons[i].offsetWidth;
      }
*/
    },
    Init: function() {
      this.createPanel();
    }
  };

  return new plugin_top_tray();
})()