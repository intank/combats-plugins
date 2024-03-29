var selectedClass = 'empty';
var width = 50;
var height = 40;
var selectedMode;

function selectModeSpan(mode) {
  for(var i=0; i<4; i++) {
    document.getElementById('mode'+i).style.display=(i==mode?'':'none');
  }
  selectedMode = mode;
}

function selectMode(e) {
  e = e || window.event;
  var obj = e.srcElement || e.target;

  selectModeSpan(obj.selectedIndex)
}

function selectClass(e) {
  e = e || window.event;
  var obj = e.srcElement || e.target;
  if (obj.nodeName=='BUTTON')
    obj = obj.firstChild;
  if (!obj || obj.nodeName!='DIV' || obj.parentNode.nodeName!='BUTTON')
    return;
  selectedClass = obj.className;

  var btn = obj.parentNode;
  btn.style.background = '#40FF40';
  obj = btn;
  while (obj.previousSibling) {
    obj = obj.previousSibling;
    obj.style.background = '#d4d0c8';
  }
  obj = btn;
  while (obj.nextSibling) {
    obj = obj.nextSibling;
    if (obj.style)
      obj.style.background = '#d4d0c8';
  }
}

function assignCell(e) {
  e = e || window.event;
  var obj = e.srcElement || e.target;
  if (obj.nodeName!='TD')
    obj = obj.parentNode;
  if (obj.nodeName!='TD')
    return;

  var x = obj.cellIndex;
  var y = obj.parentNode.rowIndex;

  function getRelative(dx,dy){
    var table = obj.parentNode.parentNode.parentNode;
    var x = obj.cellIndex;
    var y = obj.parentNode.rowIndex;
    if ((y+dy<0) || (y+dy>table.rows.length-1))
      return null;
    if ((x+dx<0) || (x+dx>table.rows[y+dy].cells.length-1))
      return null;
    return table.rows[y+dy].cells[x+dx];
  }

  if (selectedClass=='unavailable')
    obj.innerText = 'X';
  else if (selectedClass=='object')
    obj.innerText = '+';
  else if (selectedClass=='danger')
    obj.innerText = '!';
  else if (selectedClass=='simple'){
    obj.innerText = '';
    var objRt = getRelative(1,0);
    var objLt = getRelative(-1,0);
    var objUp = getRelative(0,-1);
    var objDn = getRelative(0,1);
    if (obj.className=='empty'){
      var className = 'd';
      if (objUp){
        var classNameUp = objUp.className;
        if (classNameUp=='empty'){
          className += '1';
        } else {
          objUp.className = classNameUp.replace(/5/,'');
        }
      } else {
        className += '1';
      }
      if (objRt){
        var classNameRight = objRt.className;
        if (classNameRight=='empty'){
          className += '3';
        } else {
          objRt.className = classNameRight.replace(/7/,'');
        }
      } else {
        className += '3';
      }
      if (objDn){
        var classNameDown = objDn.className;
        if (classNameDown=='empty'){
          className += '5';
        } else {
          objDn.className = classNameDown.replace(/1/,'');
        }
      } else {
        className += '5';
      }
      if (objLt){
        var classNameLeft = objLt.className;
        if (classNameLeft=='empty'){
          className += '7';
        } else {
          objLt.className = classNameLeft.replace(/3/,'');
        }
      } else {
        className += '7';
      }
      obj.className = className;
    } else {
      if (objUp){
        objUp.className = {
          'empty':'empty',
          'd':'d5',
          'd1357':'d1357',
          'd15':'d15',
          'd37':'d357',
          'd1':'d15',
          'd3':'d35',
          'd5':'d5',
          'd7':'d57',
          'd13':'d135',
          'd35':'d35',
          'd57':'d57',
          'd17':'d157',
          'd135':'d135',
          'd357':'d357',
          'd157':'d157',
          'd137':'d1357'
        }[objUp.className];
      }
      if (objRt){
        objRt.className = {
          'empty':'empty',
          'd':'d7',
          'd1357':'d1357',
          'd15':'d157',
          'd37':'d37',
          'd1':'d17',
          'd3':'d37',
          'd5':'d57',
          'd7':'d7',
          'd13':'d137',
          'd35':'d357',
          'd57':'d57',
          'd17':'d17',
          'd135':'d1357',
          'd357':'d357',
          'd157':'d157',
          'd137':'d137'
        }[objRt.className];
      }
      if (objDn){
        objDn.className = {
          'empty':'empty',
          'd':'d1',
          'd1357':'d1357',
          'd15':'d15',
          'd37':'d137',
          'd1':'d1',
          'd3':'d13',
          'd5':'d15',
          'd7':'d17',
          'd13':'d13',
          'd35':'d135',
          'd57':'d157',
          'd17':'d17',
          'd135':'d135',
          'd357':'d1357',
          'd157':'d157',
          'd137':'d137'
        }[objDn.className];
      }
      if (objLt){
        objLt.className = {
          'empty':'empty',
          'd':'d3',
          'd1357':'d1357',
          'd15':'d135',
          'd37':'d37',
          'd1':'d13',
          'd3':'d3',
          'd5':'d35',
          'd7':'d37',
          'd13':'d13',
          'd35':'d35',
          'd57':'d357',
          'd17':'d137',
          'd135':'d135',
          'd357':'d357',
          'd157':'d1357',
          'd137':'d137'
        }[objLt.className];
      }
      obj.className = 'empty';
    }
  } else {
    obj.innerText = '';
    obj.className = selectedClass;
  }
}

function doResize(new_width, new_height) {
  var Map = document.getElementById('Map');

  debugger;
  for(var i=0; i<height-new_height; i++)
    Map.deleteRow();
  for(var i=0; i<Math.min(new_height,height); i++)
    for(var j=0; j<width-new_width; j++)
      Map.rows[i].deleteCell();
  for(var i=0; i<new_height-height; i++) {
    Map.insertRow();
    for(var j=0; j<Math.min(new_width,width); j++)
      Map.rows[height+i].insertCell().className = 'empty';
  }
  for(var i=0; i<new_height; i++) {
    for(var j=0; j<new_width-width; j++)
      Map.rows[i].insertCell().className = 'empty';
  }
  width = new_width;
  height = new_height;
  document.getElementById('width').value = width;
  document.getElementById('height').value = height;
}

function setSize(e) {
  var new_width = parseFloat(document.getElementById('width').value);
  var new_height = parseFloat(document.getElementById('height').value);
/*
  var Map = document.getElementById('Map');
  for(var i=new_height; i<height; i++)
    for(var j=new_width; j<width; j++)
      if (Map.rows[i].cells[j].className!='empty') {
        if (!confirm('����� ������� �������� �����. ����������?')) {
          document.getElementById('width').value = width;
          document.getElementById('height').value = height;
          return;
        }
        break;
      }
*/
  doResize(new_width,new_height);
}

function compress(e) {
  var minX = -1;
  var minY = -1;
  var maxX = -1;
  var maxY = -1;
  var Map = document.getElementById('Map');
  for(var i=0; i<height; i++)
    for(var j=0; j<width; j++)
      if (Map.rows[i].cells[j].className!='empty') {
        if (minX<0 || j<minX) minX=j;
        if (minY<0 || i<minY) minY=i;
        if (maxX<0 || j>maxX) maxX=j;
        if (maxY<0 || i>maxY) maxY=i;
      }
  if (minY!=-1 && minX!=-1) {
    for(var i=minY; i<=maxY; i++)
      for(var j=minX; j<=maxX; j++) {
        Map.rows[i-minY].cells[j-minX].innerHTML = Map.rows[i].cells[j].innerHTML;
        Map.rows[i-minY].cells[j-minX].className = Map.rows[i].cells[j].className;
      }
    var new_width = maxX-minX+1;
    var new_height = maxY-minY+1;
  } else {
    var new_width = 0;
    var new_height = 0;
  }


  for(var i=0; i<height-new_height; i++)
    Map.deleteRow();
  for(var i=0; i<new_height; i++)
    for(var j=0; j<width-new_width; j++)
      Map.rows[i].deleteCell();
  width = new_width;
  height = new_height;
  document.getElementById('width').value = width;
  document.getElementById('height').value = height;
}

function expand() {
  var Map = document.getElementById('Map');
  Map.insertRow();
  Map.insertRow();
  for(var j=0; j<width; j++) {
    Map.rows[height].insertCell().className = 'empty';
    Map.rows[height+1].insertCell().className = 'empty';
  }
  for(var i=0; i<height+2; i++) {
    Map.rows[i].insertCell().className = 'empty';
    Map.rows[i].insertCell().className = 'empty';
  }

  for(var i=height; i>0; i--)
    for(var j=width; j>0; j--) {
      Map.rows[i].cells[j].innerHTML = Map.rows[i-1].cells[j-1].innerHTML;
      Map.rows[i].cells[j].className = Map.rows[i-1].cells[j-1].className;
    }
  for(var i=0; i<height; i++) {
    Map.rows[i].cells[0].className = 'empty';
    Map.rows[i].cells[0].innerHTML = '';
  }
  for(var j=0; j<width; j++) {
    Map.rows[0].cells[j].className = 'empty';
    Map.rows[0].cells[j].innerHTML = '';
  }

  width += 2;
  height += 2;
  document.getElementById('width').value = width;
  document.getElementById('height').value = height;
}

function rotate() {
  var Map = document.getElementById('Map');

  var rotateTable = {
    'empty':'empty',
    'd':'d',
    'd1357':'d1357',
    'd15':'d37',
    'd37':'d15',
    'd1':'d7',
    'd3':'d1',
    'd5':'d3',
    'd7':'d5',
    'd13':'d17',
    'd35':'d13',
    'd57':'d35',
    'd17':'d57',
    'd135':'d137',
    'd357':'d135',
    'd157':'d357',
    'd137':'d157'
  };

  var map = [];
  for(var i=0; i<width; i++) {
    map[i] = [];
    for(var j=0; j<height; j++) {
      if (Map.rows[j].cells[width-i-1].innerText) {
        map[i][j] = [rotateTable[Map.rows[j].cells[width-i-1].className], ''];
      } else {
      map[i][j] = rotateTable[Map.rows[j].cells[width-i-1].className];
  }
    }
  }

  applyCode(map);
}

function showCode() {
  compress();
  expand(); expand(); expand(); expand();

  var Map = document.getElementById('Map');

  var map = [];
  for(var i=0; i<height; i++) {
    var row = [];
    for(var j=0; j<width; j++)
      if (Map.rows[i].cells[j].innerText) {
        row.push("['"+(Map.rows[i].cells[j].className=='empty'?'':Map.rows[i].cells[j].className)+"','']");
      } else {
        row.push("'"+(Map.rows[i].cells[j].className=='empty'?'':Map.rows[i].cells[j].className)+"'");
      }
    map.push('['+row.join(',')+']');
  }
  var code = '[\n'+map.join(',\n')+'\n]';
  document.getElementById('code').innerText = code;
  document.getElementById('code').parentNode.style.left = ''+Math.round(document.body.offsetWidth/2-320)+'px';
  document.getElementById('code').parentNode.style.top = ''+Math.round(document.body.offsetHeight/2-220)+'px';
  document.getElementById('code').parentNode.style.display = '';
}

function hideCode() {
  document.getElementById('code').parentNode.style.display = 'none';
}

function applyCode(map) {
  if (!map) {
    try {
      map = eval('(function(){ return '+document.getElementById('code').innerText+' })()');
    } catch(e) {
      return alert("�������� ����� �� �������� ���������� ��������� �������� javascript");
    }
  }

  if (map) {
    var new_width = 0;
    var new_height = map.length;

    for(var i=0; i<map.length; i++)
      if (map[i].length>new_width)
        new_width = map[i].length;

    doResize(new_width, new_height);

    var Map = document.getElementById('Map');

    for(var i=0; i<map.length; i++)
      for(var j=0; j<map[i].length; j++) {
        var className = 'empty';
        var innerHTML = '';
        if (map[i][j]) {
          if (typeof(map[i][j])=='string')
            className = map[i][j];
          else if (typeof(map[i][j])=='object') {
            className = map[i][j][0];
            innerHTML = 'X';
          }
        }
        Map.rows[i].cells[j].className = className;
        Map.rows[i].cells[j].innerHTML = innerHTML;
      }
  }

}

function mouseover(e) {
  e = e || window.event;
  var obj = e.srcElement || e.target;
  if (obj.nodeName!='TD')
    return;
//  obj.className = '';
  document.getElementById('coord').value = obj.cellIndex+','+obj.parentNode.rowIndex
}
