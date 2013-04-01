<html><head><title>Перечень материалов</title></head><body>
<table width=100% height=100%>
<tr><td>Отображать предметы: <select id="show_type" onchange="show_type=this.value;save_cfg();ShowComponents()"><option value='0'>(все)</option><option value='1'>ингридиенты</option><option value='2'>руны</option></select>
<td><select id="locations" onchange="save_cfg();ShowRecipes()"></select></tr>
<tr height=50%><td rowspan=2><iframe id="components" width="100%" height="100%"></iframe>
<td><iframe id="recipes" width="100%" height="100%"></iframe></tr>
<tr height=50%><td><iframe id="accepted" width="100%" height="100%"></iframe></table>
<script language="JavaScript"><!--

oOptions = document.all['locations'].options;
oOptions.length = 0;
for(var i in locations) {
  var oOption = document.createElement("OPTION");
  oOptions.add(oOption);
  oOption.innerText = locations[i];
  oOption.value = ""+i;
}

var show_type = '0';
components_count=0;

var regExMater = /^http\:\/\/.+?\/item-(mater\d+)$/;
var regExItem = /^http\:\/\/.+?\/item-(.+)$/;
var regExCount = /^(.*?)\s*\(x(\d+)\)(.*?)$/;
var regExRune = /^rune[\d_]/;
var regExImgItem = /\/i\/items\/(.*?)\.gif$/i;

function ParseInventory(){
//try {

//debugger;
var cells = opener.$('tr[bgcolor]:has(img)',opener.combats_plugins_manager.getMainFrame().document).get();

for(i=0;i<cells.length;i++) {
  var src = opener.$('img:first',cells[i])[0].src;

  var matches = regExMater.exec(src);
  var is_material = matches && (matches.length>1);
  if(!is_material)
    matches = regExImgItem.exec(src);
  if(!matches)
    continue;
  var id = matches[1];
  var is_rune = (regExRune.exec(id)!=null);

  var cell = opener.$('>td:nth-child(2)',cells[i]);
  var name = opener.$('a:first',cell).text();
  matches = regExCount.exec(name);
  if(!matches)
    cnt=1;
  else {
    cnt=parseInt(matches[2]);
    name=matches[1]+(matches[3]||'');
  }
  var description = '';
  if (is_rune) {
    var match = cell.parentNode.parentNode.innerText.match(/Действует на\:[\s\n\r]+\u2022\s*(.*?)[\n\r]/);
    if (match) description = id+':"'+match[1]+'"';
  }

  for(j=0;j<components.length;j++) {
    if (components[j].id==id) {
      components[j].count+=cnt;
      break;
    }
  }
  components_count += cnt;
  if (j>=components.length)
    components.push({ 
      id:id, 
      src:'http://img.combats.com/i/items/'+id+'.gif', 
      count:cnt, 
      used:0, 
      name:name,
      description:description,
      is_material:is_material,
      is_rune:is_rune
    });
}

for(j=0;j<components.length;j++)
  components[j].src='http://img.combats.com/i/items/'+components[j].id+'.gif';

var regExpLevel=/\[\s*(\d{1,2})\s*\]/;
components.sort(function(a,b){
  var alvl = a.name.match(regExpLevel);
  var blvl = b.name.match(regExpLevel);
  if (alvl && !blvl)
    return 1;
  if (blvl && !alvl)
    return -1;
  if (alvl && blvl && alvl[1]!=blvl[1])
    return alvl[1]-blvl[1];

  if (a.name<b.name)
    return -1; 
  else if (a.name>b.name)
    return 1;
  else return 0;
});

Analyze();
ShowComponents();
ShowRecipes();
ShowAccepted();
}

function HintHide() {
  document.all['components'].contentWindow.document.all("hint").style.visibility = "hidden";
}

function HintRecipes(id,e) {
  var s='';
  for(i=0;i<recipes.length;i++) {
    for(k=0; k<recipes[i].comp.length; k+=2)
      if(id==recipes[i].comp[k]) {
        if (s)
          s += ',<br>';
        s += '<b>'+recipes[i].descr+'</b> ('+recipes[i].comp_str+')';
        break;
      }
  }
  if (s) {
    d = document.all['components'].contentWindow.document;
    hint = d.all("hint");
    hint.style.visibility = "visible";
    hint.innerHTML = s;
    hint.style.left = e.clientX;
    hint.style.top = e.clientY+d.body.scrollTop;
  }
}

function ShowComponents() {
  document.all['components'].contentWindow.document.open();

  if (components_count) {
    var s = '<html><body style="margin: 0; padding: 0;"><div id=\'hint\' style=\'position: absolute; z-index: 1; width: 80%; background: yellow; visibility: hidden;\'></div><table width=100%>';
    for(var i in components) {
      if(components[i].count && (show_type=='0' || show_type=='1' && components[i].is_material || show_type=='2' && components[i].is_rune))
        s += '<tr id="'+components[i].id+'"><td><img src="'+components[i].src+'" onmouseover="top.HintRecipes(\''+components[i].id+'\',window.event)" onmouseout="top.HintHide()"><td><b>'+components[i].name+'</b>'+(components[i].description?'<br/>'+components[i].description:'')+'<td id="'+components[i].id+'_cnt">'+components[i].count;
    }
    s += '</table></body></html>';
  } else
    s = '<font color=red>Материалы из подземелий, руны и другие предметы не найдены.</font><br>Убедитесь, что открыт правильный раздел Вашего инвентаря.';

  document.all['components'].contentWindow.document.writeln(s);
  document.all['components'].contentWindow.document.close();
}

function Accept(recipe,count) {
  recipe=recipes[recipe];
  if (0<recipe.possible) {
    recipe.accepted++;
    for(j=0; j<components.length; j++)
      for(k=0; k<recipe.comp.length; k+=2)
        if(components[j].id==recipe.comp[k]) {
          components[j].used+=recipe.comp[k+1];
          break;
        }
  }
  Analyze();
  ShowRecipes();
  ShowAccepted();
}

function Dismiss(recipe,count) {
  recipe=recipes[recipe];
  if (recipe.accepted>0) {
    recipe.accepted--;
    for(j=0; j<components.length; j++)
      for(k=0; k<recipe.comp.length; k+=2)
        if(components[j].id==recipe.comp[k]) {
          components[j].used-=recipe.comp[k+1];
          break;
        }
  }
  Analyze();
  ShowRecipes();
  ShowAccepted();
}

function Analyze() {
  for(var i in recipes) {
    m = -1;
    for(k=0; k<recipes[i].comp.length; k+=2) {
      c = 0;
      for(j=0; j<components.length; j++) {
        if (recipes[i].comp[k]==components[j].id) {
          c = Math.floor((components[j].count-components[j].used)/recipes[i].comp[k+1]);
          break;
        }
      }
      if (m<0)
        m = c;
      else
        m = Math.min(m,c);
    }
    if(m>=0) {
      recipes[i].possible = m;
    }
    if (1 || !recipes[i].comp_str) {
      s = '';
      for(k=0; k<recipes[i].comp.length; k+=2) {
        for(j=0; j<components.length; j++) {
          if (recipes[i].comp[k]==components[j].id) {
            if (s)
              s += ', ';
            if (components[j].count<recipes[i].comp[k+1])
              s += '<font color=#FF3F00>'+components[j].name+'('+recipes[i].comp[k+1]+')</font>';
            else
              s += '<img src="http://img.combats.com/i/items/'+components[j].id+'.gif" style="height:20px"/>&nbsp;'+components[j].name+'('+recipes[i].comp[k+1]+')';
            break;
          }
        }
        if (j>=components.length) {
          if (s)
            s += ', ';
          s += '<font color=#FF3F00>'+recipes[i].comp[k]+'('+recipes[i].comp[k+1]+')</font>';
        }
      }
      recipes[i].comp_str = s;
    }
  }
}

function ShowRecipes() {
  t = 0;
  if(document.all['recipes'].contentWindow.document.body)
    t = document.all['recipes'].contentWindow.document.body.scrollTop;
  document.all['recipes'].contentWindow.document.open();
  var s = '<html><body style="margin: 0; padding: 0;"><table width=100%>';
  selected_location = parseInt(document.all['locations'].value);
  for(var i in recipes) {
    if((selected_location==0 || recipes[i].location==selected_location-1) && recipes[i].possible>0) {
      s += '<tr><td><img style="cursor: pointer;" src="http://img.combats.com/i/items/'+recipes[i].name+'.gif" onclick="top.Accept(\''+i+/*recipes[i].name+*/'\',1)"><td width=100%><b>'+recipes[i].descr+'</b><td rowspan=1>'+(recipes[i].possible);
      s += '<tr><td colspan=2 style="color: #888888">Требуется: '+recipes[i].comp_str+'<td>';
    }
  }
  s += '</table></body></html>';
  document.all['recipes'].contentWindow.document.writeln(s);
  document.all['recipes'].contentWindow.document.body.scrollTop = t;
}

function ShowAccepted() {
  t = 0;
  if(document.all['accepted'].contentWindow.document.body)
    t = document.all['accepted'].contentWindow.document.body.scrollTop;
  document.all['accepted'].contentWindow.document.open();
  var s = '<html><body style="margin: 0; padding: 0;"><table width=100%>';
  for(i=0; i<recipes.length; i++) {
    if(recipes[i].accepted>0) {
      s += '<tr><td><img style="cursor: pointer;" src="http://img.combats.com/i/items/'+recipes[i].name+'.gif" onclick="top.Dismiss(\''+i+/*recipes[i].name+*/'\',1)"><td width=100%><b>'+recipes[i].descr+'</b><td rowspan=1>'+recipes[i].accepted;
      s += '<tr><td colspan=2 style="color: #888888">Требуется: '+recipes[i].comp_str+'<td>';
    }
  }
  s += '</table></body></html>';
  document.all['accepted'].contentWindow.document.writeln(s);
  document.all['accepted'].contentWindow.document.close();
  document.all['accepted'].contentWindow.document.body.scrollTop = t;
}

load_cfg();

ParseInventory();

function save(sect,key,val){external.m2_writeIni(security_id,"Combats.RU","recipes\\underground.ini",sect,key,val);}
function load(sect,key,def_val){return external.m2_readIni(security_id,"Combats.RU","recipes\\underground.ini",sect,key,def_val);}
function save_cfg() {
  save('settings','show_type',show_type);
  save('settings','locations',document.all['locations'].value);
}
function load_cfg() {
  document.all['show_type'].selectedIndex = show_type = load('settings','show_type','0');
  document.all['locations'].value = load('settings','locations','0');
}

//} catch (e) {
//  alert(e.message+'\n'+e.description);
//}
//-->
</script>
