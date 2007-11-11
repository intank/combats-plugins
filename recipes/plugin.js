(function() {

  top.combats_plugins_manager.plugins_list['top_tray'].addButton({
    'button': {
      'style': {
        'width': "20px",
        'height': "20px",
        'padding': "2px",
        'background': "#505050"
        },
      'onclick': function() {
        s=external.readFile(combats_plugins_manager.security_id,"Combats.RU","recipes\\recipes.js")

        w=window.open('about:blank');
        w.document.writeln('<script>var security_id=opener.combats_plugins_manager.security_id;</script>');
        w.document.writeln(s);
        
        }
      },
    'img': {
      'style': {
        'width': "16px",
        'height': "16px"
        },
      'onmouseout': function() {
          this.src = "file:///"+combats_plugins_manager.base_folder+"recipes/combats0.ico";
        },
      'onmouseover': function() {
          this.src = "file:///"+combats_plugins_manager.base_folder+"recipes/combats1.ico";
        },
      'src': "file:///"+combats_plugins_manager.base_folder+"recipes/combats0.ico",
      'alt': "Анализ содержимого рюкзака"
      }
    });

  return null;
})()