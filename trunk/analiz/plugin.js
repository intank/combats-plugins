(function(){
  top.combats_plugins_manager.plugins_list['top_tray'].addButton({
    'button': {
      'style': {
        'width': "20px",
        'height': "20px",
        'padding': "2px",
        'background': "#505050"
        },
      'onclick': function() {
          window.open('http://www.darklaw.ru/modules/bots/analiz.php?login='+top.getCookie('battle'));
        }
      },
    'img': {
      'style': {
        'width': "16px",
        'height': "16px",
        'filter': "Glow(color=#DDDDDD,Strength=3,Enabled=0)"
        },
      'onmouseout': function() {
          this.filters.Glow.Enabled=0;
        },
      'onmouseover': function() {
          this.filters.Glow.Enabled=1;
        },
      'src': "file:///"+combats_plugins_manager.base_folder+"analiz/Combats.gif",
      'alt': "Анализ поединка"
      }
    });

  return null;
})()