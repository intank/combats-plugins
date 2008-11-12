function wu(inv,name,id,align,klan,level,slp,trv,city,att,private,afk,afk_text,dnd,dnd_text,bat,ill,sms) {
	var opener="";
	var s="";
	var filter = '';
	var str_length = 22;
	if (dnd_text) {
		dnd_text = write_br(dnd_text);
	}
	if (afk_text) {
		afk_text = write_br(afk_text);
	}
	function write_br(str) {
		var s = str.split(/ /);
		var c = 0;
		for (i=0;i<s.length;i++) {
			c = c+s[i].length+1;
			if (c>=str_length && i>0) {
				s[i-1] += '<br>';
				c=s[i].length;
			}
		}
		r = s.join(' ');
		return r.replace(/"/g,"");
	}
	if (bat>0) filter = 'style="filter:invert"';
	if (klan.length>0) {
		klan='<A HREF="http://capitalcity.combats.com/encicl/klan/'+klan+'.html" target=_blank><IMG SRC="http://img.combats.com/i/klan/'+klan+'.gif" WIDTH=24 HEIGHT=15 BORDER=0 ALT=""></A>';
	}
	s+=((ill!='' || inv)?'<SPAN style="background-Color: #dad2d2">':'');
	if (private>0) s+='<a href="javascript:'+opener+'top.AddToPrivate(\''+name+'\',true)"><IMG SRC="http://img.combats.com/i/lock.gif" '+filter+' WIDTH=20 HEIGHT=15 BORDER=0 ALT="Приват"></a>';
	s+='<IMG SRC="http://img.combats.com/i/align'+align+'.gif" WIDTH=12 HEIGHT=15 BORDER=0 ALT="">'+klan;
	if (dnd>0) s+='<font style=\'font-size:11px;\' onmouseover="javascript:fastshow(\''+dnd_text+'\');" onmouseout=\'javascript:hideshow();\'><b>dnd</b></font> ';
	if (afk>0 & !dnd) s+='<font style=\'font-size:11px;\' onmouseover="javascript:fastshow(\''+afk_text+'\');" onmouseout="javascript:hideshow();"><b>afk</b></font> ';
	s+='<a href="javascript:'+opener+'top.AddTo(\''+name+'\')">'+name+'</a>';
	if (sms!='') s+=' <span style=\'font-size:10px;\'>sms</span>';
	if (inv>0) s+='(the invisible) ';
	s+=((ill!='')?' = <a href="javascript:'+opener+'top.AddTo(\''+ill+'\')">'+ill+'</a>':'');
	s+='['+level+']<a href="/inf.pl?'+id+'" target=_blank>'+
	'<IMG SRC="http://img.combats.com/i/inf'+city+'.gif" WIDTH=12 HEIGHT=11 BORDER=0 ALT="Инф. о '+name+'"></a>'+
	((ill!='' || inv)?'</SPAN>':'');
	if (slp>0) { s+=' <IMG SRC="http://img.combats.com/i/sleep2.gif" WIDTH=24 HEIGHT=15 BORDER=0 ALT="Наложено заклятие молчания">'; }
	if (trv>0) { s+=' <IMG SRC="http://img.combats.com/i/travma2.gif" WIDTH=24 HEIGHT=15 BORDER=0 ALT="Инвалидность">'; }
	if ( (att!="0" && att) || (myalign>1 && myalign<2 && align>3 && align < 4) || (align>1 && align<2 && myalign>3 && myalign < 4)) {
		s+=' <A style="cursor: hand" onclick="top.cmloc(\'/main.pl?attackc='+name+'&'+(Math.random())+'\')"><IMG src="http://img.combats.com/i/misc/curse_attack'+att+'.gif" width=13 height=13></A>';
	}
	spisok += s+'<br>';
}
function write_spisok(write) {
	if (!write) return;
	room.innerHTML = room_name;
	if (top.aun > 0) pw();
	users.innerHTML = spisok;
}
function pw() {
	var cnt = 250;
	var pager_str = '';
	var pages = Math.floor(aua/cnt);
	if (pages != aua/cnt) pages++;
	if (pages<=0) pages++;
	if (aua>cnt) {
		for (i=1;i<=pages;i++) {
			if (top.aun == i) {
				pager_str += '[<a href="#" style="color:#8F0000;" onclick="pa('+i+');"><u>'+i+'</u></a>]';
			} else {
				pager_str += '[<a href="#" onclick="pa('+i+');">'+i+'</a>]';
			}
		}
	}
	pager.innerHTML = '<div style="margin:0px 0px 4px 0px;">'+pager_str+'</div>';
}
function pa(num) {
	top.aun = num;
	top.RefreshChat(1);
	top.NextRefreshChat();
	return false;
}
function fastshow (content) {
	var el = document.getElementById("mmoves");
	var o = window.event.srcElement;
	if (content!='' && el.style.visibility != "visible") {el.innerHTML = '<small>'+content+'</small>';}
	var x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft + 3;
	var y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop+5;
	el.style.left = x + "px";
	el.style.top  = y + "px";
	if (el.style.visibility != "visible") {
		el.style.visibility = "visible";
	}
}
function hideshow() {
	document.getElementById("mmoves").style.visibility = 'hidden';
}
