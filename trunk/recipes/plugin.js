(function() {
  var w;
  top.combats_plugins_manager.plugins_list['top_tray'].addButton({
    'button': {
      'style': {
        'width': "20px",
        'height': "20px",
        'padding': "2px",
        'background': "#505050"
        },
      'onclick': function() {
          if (!w || w.closed) {
            var s=external.readFile(combats_plugins_manager.security_id,"Combats.RU","recipes\\recipes.js")
            var ss=external.readFile(combats_plugins_manager.security_id,"Combats.RU","recipes\\data.js")

            w=window.open('about:blank');
            if (!w.opener)
              w.opener = top;
            w.document.writeln('<script type="text/javascript">var security_id="'+top.combats_plugins_manager.security_id+'";</sc'+'ript>');
            w.document.writeln('<script type="text/javascript">' + ss + '</sc'+'ript>');
            w.document.writeln(s);
          } else {
            w.ParseInventory();
          }
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