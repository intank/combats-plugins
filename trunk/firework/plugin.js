(function(){
  top.combats_plugins_manager.plugins_list['top_tray'].addButton({
    'button': {
      'style': {
        'width': "40px",
        'height': "20px",
        'padding': "2px",
        'background': "#505050",
        'position': 'relative',
        'overflow': 'hidden'
        },
      'onclick': function() {
          for(var i=Math.round(Math.random()*10)+5;i--;) {
            top.setTimeout(
              function() {
                top.fireworks(
                  Math.round(Math.random()*300),
                  Math.round(Math.random()*200),
                  Math.round(Math.random()*5+1));
                top.fireworks(-1,0,0);
              },
              Math.random()*500+1000
            );
          }
        }
      },
    'img': {
      'style': {
        'position': 'absolute',
        'left': '-2px',
        'top': '-5px',
        'width': '43px',
        'height': '35px'
        },
      'onmouseout': function() {
          this.parentNode.style.background = '#505050';
          this.src='file:///'+combats_plugins_manager.base_folder+'firework/rocket_3.gif';
        },
      'onmouseover': function() {
          this.parentNode.style.background = '#E8E8E8';
          this.src='file:///'+combats_plugins_manager.base_folder+'firework/rocket.gif';
        },
      'src': 'file:///'+combats_plugins_manager.base_folder+'firework/rocket_3.gif',
      'alt': "Фейерверк"
      }
    });

  return null;
})()
