<script language="javascript">

city = /http:\/\/(.*?)city\.combats\.ru/.exec(document.location);
if (city) {
  hostname=city[1];
}      

//канстанты, блять)
AutoAttack=0;  //автонападение на ботов, ставим Адын(1) если хотите безжалостно нападать на любое тело, которое окажется перед вами
AutoStep=0;    //хождение по левой стенке. опция обхода лабиринта по левой стене, для большинства подземок не катит (телепорты, ловушки и т.п.)
pet=0;         //выпускать зверя. если животина накормлена, канешн
rules=1;       //стратегия приемов. группа правил для настройки логики приемов под разные комплекты
fixed=1;       //фиксированные зоны ударов блоков


//используемые приемы. если прием не нужен, просто исказите его название, чтобы оно не было равным мнемонике самого приема
//добавлять по аналогии

block_activeshield = 'block_activeshield';
block_fullshield = 'block_fullshield';

counter_ward = 'отключена';
counter_bladedance = 'отключена';
counter_deathwalk  = 'counter_deathwalk';

hp_enrage = 'hp_enrage'
hp_defence = 'hp_defence'
hp_circleshield = 'отключена';
hp_cleance = 'hp_cleance';

multi_hiddenpower = 'multi_hiddenpower';
multi_skiparmor = 'отключена';
multi_hitshock = 'отключена';
multi_hiddendodge = 'multi_hiddendodge';

hit_empower = 'hit_empower';
hit_willpower = 'hit_willpower';

spirit_block25 = 'spirit_block25';

krit_wildluck = 'krit_wildluck';
krit_blindluck = 'krit_blindluck';
krit_bloodlust = 'krit_bloodlust';

parry_secondlife = 'parry_secondlife';
parry_prediction = 'parry_prediction';

//фрейм строки чата. после переделки джижка на аякс может не работать, не проверялось   
var BKBOTFLbottomframe = document.frames('bottom');

//список подземных ругательств - останавливает повторный юз предмета, если подобная херь появилась на экране
var RError = /Ничего не произошло|Охранники ключа ещё живы|Часть монстров все еще жива|Для использования нужен ключ|Это предмет для/i;

//список хренотеней, которые бот будет юзать не думая
var R4click = /Мерцающий круг|Мерцающий Ключ|Дорога в Один Конец|Простой сундук|Дорога в один конец|Сундук|Кровать|Алтарь Бездны|Лаборатория1|Купель|Тележка|Спуск/i;

//вывод текста в строку чата, может не работать, требуется правка
function WriteStr(str) {
  BKBOTFLbottomframe.window.document.F1.text.value = str;
}
  
//поиск меинфрейма опосля ввода ябучей защиты от воровства фрейма на РВС сайтах  
function get_main(){
  r = /^main/i
  for (i = 0; i < document.frames.length; i++) {
    ra = r.exec(document.frames[i].name);
    if (ra!=null) {
      tmp=document.frames[i].name;
      return document.frames(tmp);
    }
  }
}

//возвращает кол-во набранных тактик
function BonusValue(str)
{   
  l = document.getElementsByTagName("SPAN").length;  
  for (i=0; i<l; i++) {    
    ts = document.getElementsByTagName("SPAN")[i];
    if (ts.innerHTML.indexOf('/' + str + '.gif') >= 0) {
      res = /<SPAN>(\d+)<\/SPAN>/.exec(ts.innerHTML);
      if (res) {        
        return res[1];
      }  
    }  
  }  
  return 0;
}

//проверяет, активирован ли искомый прием
function TrickOn(inobj, str)
{
  l = inobj.getElementsByTagName("button").length;  
  for (i=0; i<l; i++) {
    if (inobj.getElementsByTagName("button")[i].className == 'UserSlotEffect') {      
      ts = inobj.getElementsByTagName("button")[i];
      if (ts.innerHTML.indexOf(str + '.gif') >= 0) {
        return 1;
      }
    }
  }
  return 0;
}

//текущие хп перса. это если впадлу или стремно нападать с крассными хп, например
function GetHP(inobj)
{
  res = /top\.setHP\((\d+),(\d+),(\d+)\)/.exec(inobj.body.innerHTML);  
  if (res) {
    return res[1];
  } else {
    return '';
  }      
  //top.setHP(1537,1567,275)
}

//активировать прием
function GoToLink(sublink)
{   
  //alert (inobj.body.innerHTML);
  var l = document.getElementsByTagName("button").length;  
  for (i=0; i<l; i++) {
    var ts = document.getElementsByTagName("button")[i];
    if (ts.className == 'UserBattleMethod') {            
      if (ts.innerHTML.indexOf(sublink + '.gif') >= 0) {
        ts.click();
        return 1;
      }
    }
  }
  return 0;
}

//поиск нужной кнопки
function BKBOTFindButton(inobj, ftype, fvalue, fname)
{

  l = inobj.document.getElementsByTagName("button").length;  
 if (inobj != null)
 {
  for (i = 0; i < inobj.length; i++)
  {
   var isValue = false;
   var isType = false;
   var isName = false;

   if (fname != null && inobj[i].name == fname)
   {
    isName = true;
   }

   if (fvalue != null && inobj[i].value == fvalue)
   {
    isValue = true;
   }

   if (ftype != null && inobj[i].type == ftype)
   {
    isType = true;
   }

   if ( ((fname != null && isName) || fname == null) && ((fvalue != null && isValue) || fvalue == null) && ((ftype != null && isType) || ftype == null))
   {
    return inobj[i];
   }
  }
 }
 return false;
}

//считать текст из строки чата. пригодиться, если вам придет гениальная идея юзать строку ввода в чат для хранения переменных состояния бота
function ReadStr() {
  return BKBOTFLbottomframe.window.document.F1.text.value;
}


//я_вижу_ебучую_панель_ударов ДА/НЕТ?))
function RadioPanel (inobj) {  
  l = document.getElementsByTagName("button").length;  
  for (i=0; i<l; i++) {
    if (document.getElementsByTagName("button")[i].className == 'UnitBattleAttackDisable') {
      return 1;
    }
  }
  return 0;
}

//выставление зон удара
function RadioPanelSetA (inobj, n) {
  l = document.getElementsByTagName("button").length;  
  idx = 0; 
  for (i=0; i<l; i++) {
    if (document.getElementsByTagName("button")[i].className == 'UnitBattleAttackDisable' || document.getElementsByTagName("button")[i].className == 'UnitBattleAttack') {
      idx++;
      if (document.getElementsByTagName("button")[i].className == 'UnitBattleAttackDisable') {
        if (idx == n) {
          document.getElementsByTagName("button")[i].click();
          break;
        }
      }  
    }
  }
}

//выставление зон блока
function RadioPanelSetD (inobj, n) {
  l = document.getElementsByTagName("button").length;  
  idx = 0; 
  for (i=0; i<l; i++) {
    if (document.getElementsByTagName("button")[i].className == 'UnitBattleDefendDisable' || document.getElementsByTagName("button")[i].className == 'UnitBattleDefend') {
      idx++;
      if (document.getElementsByTagName("button")[i].className == 'UnitBattleDefendDisable') {
        if (idx == n) {
          document.getElementsByTagName("button")[i].click();
          break;
        }  
      }
    }
  }
}

//какая то пимпа на панели ударов
function RadioPanelButton (inobj, cname) {
  l = document.getElementsByTagName("button").length;  
  for (i=0; i<l; i++) {
    if (document.getElementsByTagName("button")[i].className == cname) {
      return document.getElementsByTagName("button")[i];
    }
  }
}

if (BKBOTlastact == null)
{
 var BKBOTivl = null;
 var BKBOTlastact = 0;

    //тело бота. вызывается в цикле. логика работы - идет пост опрос страницы с попыткой распознать текущее состояние. если состояние распознано - выполнять какие-то действия
 function BKBOTcheckBit()
 {    
  BKBOTlastact++;
  var BKBOTmainframe = get_main();        
  if (BKBOTmainframe.document.readyState == 'complete' && BKBOTmainframe.document.body != null && BKBOTmainframe.document.body.readyState == 'complete' && BKBOTlastact >= 1)
  {
      var BKBOThtml = new String(BKBOTmainframe.document.body.innerHTML);
                                      
   if (RadioPanel(BKBOTmainframe) && BKBOThtml == '')
            //это мы в бою с каким то ебучим ботом)
   {
                
    var BKBOTattackbtn = RadioPanelButton(BKBOTmainframe, 'UserBattleCommit');                
                
    if (BKBOTattackbtn)
    {
                    //защита - наше все
                    if (RadioPanel(BKBOTmainframe)) {
        var BKBOTdefend = Math.floor(Math.random()*5);
                       if (fixed) {
                         BKBOTdefend = 4;
                       }
        RadioPanelSetD(BKBOTmainframe, BKBOTdefend);
                    }
                    
                    //зоны ударов и блоков нумеруются слева направо сверху вниз
                    //в блоке ниже выставляеются 2 удара во 2ю и 5ю точки 
                    RadioPanelSetA(BKBOTmainframe, 2);
                    RadioPanelSetA(BKBOTmainframe, 5);

                    //а этот блок под витое и 2 пушки, раскомментируйте если надо)
                    /*RadioPanelSetA(BKBOTmainframe, 1);
                    RadioPanelSetA(BKBOTmainframe, 8);
                    RadioPanelSetA(BKBOTmainframe, 15);*/
                    
   

                    //ниже пошла логика юза приемов. если хватит базовых знаний примитовного языка джаа - пишите под себя) 
                    //полная и активная защиты
     if (!(TrickOn(BKBOTmainframe.document, block_activeshield) || TrickOn(BKBOTmainframe.document, block_fullshield))) {
       if (GoToLink(block_fullshield)) {
        BKBOTlastact = 0;
       } else
       if (GoToLink(block_activeshield)) {
        BKBOTlastact = 0;
       }
     }                                                                                 
                  
                    //если полная не включена - юзаем осторожность
                    if (!(TrickOn(BKBOTmainframe.document, block_fullshield))) {
                        if (GoToLink(counter_ward)) {
                  BKBOTlastact = 0;
                        }
                    }

                    //если набрали 8 сердец - юзаем ярость
                    if (BKBOTlastact > 0 && (BonusValue('hp') >= 8)) {
                        if (GoToLink(hp_enrage)) {
                          BKBOTlastact = 0;
                        }
                    }

                    //если набрали 8 сердец - юзаем стойкость
                    if (BKBOTlastact > 0 && (BonusValue('hp') >= 5)) {
                        if (GoToLink(hp_defence)) {
                          BKBOTlastact = 0;
                        }
                    }
                    
                    //круговая защита. для извращенцев.
                    if (BKBOTlastact > 0 ) {
                        if (GoToLink(hp_circleshield)) {
                          BKBOTlastact = 0;
                        }
                    }
                    
                    
                    //если 9+ контров - юзаем танец лезвий
     if (BKBOTlastact > 0 && (BonusValue(2) >= 9)) {
                        if (GoToLink(counter_bladedance)){
                           BKBOTlastact = 0;
                        } 
                    }

                    //если включены усиленные удары или поступь смерти - юзаем скрытую силу (серия)
                    if (BKBOTlastact > 0 && (TrickOn(BKBOTmainframe.document, counter_deathwalk)||TrickOn(BKBOTmainframe.document, hit_empower))) {
                      if (GoToLink(multi_hiddenpower)) {
                        BKBOTlastact = 0;
                      }
                    }
                    
                    //если набрали 6 ударов и не включена поступь смерти - юзаем усиленные удары
                  if (!rules && BKBOTlastact > 0 && (BonusValue(0) >= 6) && !TrickOn(BKBOTmainframe.document, counter_deathwalk)) {
                        if (GoToLink(hit_empower)){
                           BKBOTlastact = 0;
                        } 
                    }

                   //если насобирали 23 контра - поступь смерти, не пропадать же добру нах
                   if (BKBOTlastact > 0) {
                      if (BonusValue(2) >= 23) {
                        if (GoToLink(counter_deathwalk)) {
                          BKBOTlastact = 0;
                        }  
                      }
                    }

                   //если насобирали 8 ударов - усиленные удары. тут логика в том ,чтобы зарезервировать мечи под серии, но это субьективно
                   if (BKBOTlastact > 0) {
                      if (BonusValue(0) >= 8) {
                        if (GoToLink(hit_empower)) {
                          BKBOTlastact = 0;
                        }  
                      }
                    }

                    //точный удар - отключен нах (см название приема). патамушта гавно
                    if (BKBOTlastact > 0 && (GetHP(BKBOTmainframe.document) != 'red')) {
                      if (GoToLink(multi_skiparmor)) {
                        BKBOTlastact = 0;
                      }
                    }

                    //воля к победе, если красные хп. 
                    if (BKBOTlastact > 0 && (GetHP(BKBOTmainframe.document) == 'red')) {
                      if (GoToLink(hit_willpower)) {
                        BKBOTlastact = 0;
                      }
                    }


                    //выпускаем животину если взведен флаг
                    if (BKBOTlastact > 0 && pet) {
                      if (GoToLink('pet_unleash')) {
                        BKBOTlastact = 0;
                      }
                    }            

                    //если засрали зомби - очищаемся кровью
                    if (BKBOTlastact > 0 && (TrickOn(BKBOTmainframe.document, 'wis_dark_souleat') || 
                                             TrickOn(BKBOTmainframe.document, 'wis_water_poison08')
                                            )) {
                      if (GoToLink(hp_cleance)) {
                        BKBOTlastact = 0;
                      }
                    }
   
                    //если можем - юзаем:
                    //тут на фонарь, если остались бонусы, то юзаем что можем
                    if (BKBOTlastact > 0  &&                     
                        !GoToLink(multi_hiddendodge) &&                   
                        !GoToLink(spirit_block25) &&                     //призрачная защита
                        !GoToLink(krit_wildluck) &&                      //дикая удача
                        !GoToLink(krit_blindluck) &&                     //слепая удача
                        !GoToLink(krit_bloodlust) &&                     //жажда крови
                        !GoToLink(multi_hitshock) &&                    //шокер
                        !GoToLink(parry_secondlife) &&                   //паррирование + хп
                        !(rules && GoToLink(counter_deathwalk)) &&       //поступь смерти если rules<>0
                        !(rules && GoToLink(hit_empower)) &&       
                        !GoToLink(hit_willpower) &&                      //воля к победе
                        !GoToLink(parry_prediction)) {                   //парир без хп
      BKBOTattackbtn.click();
                        //alert(BKBOTattackbtn.visible);
              }
                    BKBOTlastact = 0;
    }
   }

   else if (BKBOThtml.indexOf('Ожидаем хода противника...') >= 0)
   {
                //обновляемся если боты тупят. 
    var BKBOTrefreshbtn = RadioPanelButton(BKBOTmainframe, 'UserBattleRefresh');
                
    if (BKBOTrefreshbtn)
    {
     if (BKBOTlastact >= 3)
     {
      BKBOTrefreshbtn.click();
      BKBOTlastact = 0;
     }
    }
   }
   else if (BKBOThtml.indexOf('Вы парализованы и не можете предпринимать никаких действий...') >= 0)
            //а это нас какая то хуйня укусила. если дух в КПП, то не фатально, обновляимся
   {
    var BKBOTrefreshbtn = RadioPanelButton(BKBOTmainframe, 'UserBattleRefresh');
    if (BKBOTrefreshbtn)
    {
     if (BKBOTlastact >= 3)
     {
      BKBOTrefreshbtn.click();
      BKBOTlastact = 0;
     }
    }
   }
            
   else if (BKBOThtml.indexOf('Для вас бой окончен. Ожидаем пока закончат и другие игроки...') >= 0)
            //вам пиздец, поздравляю)
   {
    if (BKBOTlastact >= 20)
    {
     var BKBOTrefreshbtn = RadioPanelButton(BKBOTmainframe, 'UserBattleRefresh');
                    //BKBOTFindButton(BKBOTmainframe.document.forms['f1'].elements, 'submit', 'Обновить', 'battle');
     if (BKBOTrefreshbtn) { BKBOTrefreshbtn.click(); }
     BKBOTlastact = 0;
    }
   }
            
   else if (BKBOThtml.indexOf('Бой закончен.') >= 0)
            //выходим из боя
   {
    if (BKBOTlastact >= 20)
    {
     var BKBOTrefreshbtn = RadioPanelButton(BKBOTmainframe, 'UserBattleEnd');                
     if (BKBOTrefreshbtn) { BKBOTrefreshbtn.click(); }
     BKBOTlastact = 150;
    }
   }
            
   else if (BKBOThtml.indexOf('The server is temporarily busy. Try again later') >= 0)
            //ага. подземка лагает, обновляем интенсивнее, пусть страдают усе)
   {
    if (BKBOTlastact >= 10)
    {
     get_main().document.location = "http://" + hostname + "city.combats.ru/battle.pl";
     BKBOTlastact = 0;
    }
   }

   else if (BKBOThtml.indexOf('Internal Server Error') >= 0)
            //аналогично
   {
    if (BKBOTlastact >= 5)
    {
     get_main().document.location = "http://" + hostname + "city.combats.ru/battle.pl";
     BKBOTlastact = 0;
    }
   }
      else if (!RError.test(BKBOTmainframe.document.body.innerText) && GoToLink('dungeon.pl?get=')) 
   {
    //берем че плохо лежит (квестовый лут и прочее гуано)   
            }

      else if (BKBOTmainframe.document.all.lv2o != null && !RError.test(BKBOTmainframe.document.body.innerText))
            //юзаем стоящие перед собой предметы. см регверы в разделе констант
   {
                var obj1 = BKBOTmainframe.document.all.lv2o;
    if (BKBOTlastact >= 10 && R4click.test(obj1.alt))
    {
                    obj_id = /dungeon_obj\(\'(\d+)\'\)/.exec(obj1.onclick)[1];
     BKBOTmainframe.document.location = "http://" + hostname + "city.combats.ru/dungeon.pl?useobj=" + obj_id + '&r=' + Math.random();
     BKBOTlastact = BKBOTlastact - 50;
    }
   }

      if (/attack=1&use=Напасть','.*?'/.test(BKBOTmainframe.document.body.innerHTML))
            //нападаем, блять, мы же смелые
   {
                if (BKBOTlastact >= 10 && AutoAttack) {

                    if (monster_id = /attack=1&use=Напасть','(.*?)'/.exec(BKBOTmainframe.document.body.innerHTML))
                    {                       
                       if (GetHP(BKBOTmainframe.document) != 'red') {
        BKBOTmainframe.document.location = "http://" + hostname + "city.combats.ru/dungeon.pl?attack=" + monster_id[1];
                       }                           
        BKBOTlastact = 0;
                    }
    }
   }

            //ниже идет блок перемещения по подземке. либо автообходом по левой стене, либо посредством набора инструкций
            //mхmхmхmх...mх, где х - номер кнопки на селекторе движения (1-8). со включенной опцией автонападения бот обходил 
            //любую подземку, убивая всех и собирая все что нужно. набор комманд определяет маршрут, был такой алгоритмический тренажер для школьников, "ПЫЛЕСОСИК", блять) навеяло
            if (AutoStep && BKBOTmainframe.document.all.m1 != null && BKBOTlastact >= 120 && ReadStr().indexOf('вперед') == 0) {
               BKBOTmainframe.document.location = BKBOTmainframe.document.all.m1.href;
               BKBOTlastact = 0;
            }

            if (BKBOTmainframe.document.all.m8 != null && BKBOTlastact >= 120 && ReadStr().indexOf('+') == 0) {
               cmd = ReadStr()
               step = ''; 
               if (cmd.length > 1) {
                 step = cmd.substring(1, 3);
                 if (step.substring(0, 1) == 'm') {
                   BKBOTmainframe.document.location = BKBOTmainframe.document.all(step).href;
                 }
                 BKBOTFLbottomframe.window.document.F1.text.value = '+' + cmd.substring(3);
               }
               if (step == 'm8' || step == 'm2') {
                 BKBOTlastact = 160;
               } else {
                 BKBOTlastact = 0;
               }  
            }

      if (AutoStep && BKBOTmainframe.document.all.m8 != null && ( (BKBOTlastact >= 120) || ( ReadStr().indexOf('поворот') == 0 && BKBOTlastact > 0 ) ) ) {
              if (BKBOTFLbottomframe.window.document.F1.text.value == 'поворот') {
                 if (BKBOTmainframe.document.all.m1 != null) {
     BKBOTmainframe.document.location = BKBOTmainframe.document.all.m1.href;
                    BKBOTFLbottomframe.window.document.F1.text.value = '';
     } else {
                    BKBOTmainframe.document.location = BKBOTmainframe.document.all.m8.href;
                    BKBOTFLbottomframe.window.document.F1.text.value = 'поворот';
                 }
              }
        else if (BKBOTmainframe.document.all.m7 != null) {
       BKBOTmainframe.document.location = BKBOTmainframe.document.all.m8.href;
                BKBOTFLbottomframe.window.document.F1.text.value = 'поворот';
              }
        else if (BKBOTmainframe.document.all.m1 != null) {
       BKBOTmainframe.document.location = BKBOTmainframe.document.all.m1.href;
                BKBOTFLbottomframe.window.document.F1.text.value = '';
              }
        else {
       BKBOTmainframe.document.location = BKBOTmainframe.document.all.m2.href;
                BKBOTFLbottomframe.window.document.F1.text.value = 'поворот направо';
              }
              BKBOTlastact = 0;
   }
  }
 }
 BKBOTivl = setInterval("BKBOTcheckBit()", 500);
 alert('Авто бой успешно запущен!');

}
else
{
 clearInterval(BKBOTivl);
 alert('ВНИМАНИЕ! ВЫ ВЫКЛЮЧИЛИ АВТО-БОЙ!');
 BKBOTlastact = null;
}

</script>
