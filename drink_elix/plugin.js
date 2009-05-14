(function(){
  return {
    debugging: false,
    lastLoadTime: 'never',
    NO_ELIX: 1,
    DRINK_OK: 2,
    DRINK_UNKNOWN: 3,
    waitList: {},
    spellsRequired: {
      'spell_powerHPup5': 'Жажда Жизни +5',
      'food_l11_e': 'Жесткая Рыба'
    },
    criticalTime: 180, // 3 минуты
    requestsQueue: [],
    toString: function() {
      return "Выпивание эликсира";
    },
    getProperties: function() {
      var spellsRequired = [];
      for(var i in this.spellsRequired)
        spellsRequired.push(i+'='+this.spellsRequired[i]);
      return [
        { name: "Активен", value: this.active },
        { name: "Только в подземельях", value: this.dungeonOnly },
        { name: "Пить элики жизни", value: this.autoDrinkHP },
        { name: "Использовать склянки из Грибницы", value: this.useSpawnElix },
        { name: "Пить статовые элики", value: this.autoDrinkStat },
        { name: "Пить элики от урона", value: this.autoDrinkDamage },
        { name: "Пить элики от стихий", value: this.autoDrinkMagic },
        { name: "Пить элики восстановления", value: this.autoDrinkRegen },
        { name: "Пить элики регенерации маны", value: this.autoDrinkRegenMana },
        { name: "Минимальный допустимый % HP", value: this.autoDrinkLevel },
        { name: "Перечень обязательно используемых эффектов", value: spellsRequired.join('\n'), type: 'textarea' },
        { name: "Задать горячую клавишу для эликсиров жизни", value: this.setHotKey},
        { name: "Отладка", value:this.debugging }
      ];
    },
    isStat: {
      'str': true,
      'dex': true,
      'inst': true,
      'intel': true
    },
    elix: {
      'str': [
        'pot_base_1000_str',
        'pot_base_200_bot3',
        'pot_base_50_str',
        'pot_base_50_str2'
      ],
      'dex': [
        'pot_base_1000_dex',
        'pot_base_200_bot2',
        'pot_base_50_dex',
        'pot_base_50_dex2'
      ],
      'inst': [
        'pot_base_1000_inst',
        'pot_base_200_bot1',
        'pot_base_50_inst',
        'pot_base_50_inst2'
      ],
      'intel': [
        'pot_base_200_bot4',
        'pot_base_50_intel',
        'pot_base_50_intel2'
      ],
      'def': [
        'pot_base_200_alldmg2_p1k',
        'pot_base_200_alldmg2',
        'pot_base_200_alldmg3',
        'pot_base_50_damageproof',
        'pot_base_50_drobproof'
      ],
      'defmag': [
        'pot_base_200_allmag2_p1k',
        'pot_base_200_allmag2',
        'pot_base_200_allmag3',
        'pot_base_100_allmag1',
        'pot_base_50_magicproof',
        'pot_base_150_airproof',
        'pot_base_150_earthproof',
        'pot_base_150_fireproof',
        'pot_base_150_waterproof',
        'pot_base_50_airproof',
        'pot_base_50_earthproof',
        'pot_base_50_fireproof',
        'pot_base_50_waterproof'
      ],
      'reg': [
        'pot_base_50_regeneration',
        'pot_base_50_gghpregen'
      ],
      'regmana': [
        'pot_base_50_mana_regen',
        'pot_base_50_ggmanaregen'
      ]
    },
    addicts: {
      'ele_addict_magicresist_10' : 'def',
      'ele_addict_magicresist' : 'defmag',
      'ele_addict_speedMana' : 'regmana',
      'ele_addict_speedHP' : 'reg',
      'ele_addict_str' : 'srt',
      'ele_addict_dex' : 'dex',
      'ele_addict_inst' : 'inst',
      'ele_addict_intel' : 'intel'
    },
    effects: {
      'icon_pot_base_100_allmag1' : 'defmag',
      'icon_pot_base_1000_dex' : 'dex',
      'icon_pot_base_1000_inst' : 'inst',
      'icon_pot_base_1000_str' : 'str',
      'icon_pot_base_150_airproof' : 'defmag',
      'icon_pot_base_150_earthproof' : 'defmag',
      'icon_pot_base_150_fireproof' : 'defmag',
      'icon_pot_base_150_waterproof' : 'defmag',
      'icon_pot_base_200_alldmg2' : 'def',
      'icon_pot_base_200_alldmg2_p1k' : 'def',
      'icon_pot_base_200_alldmg3' : 'def',
      'icon_pot_base_200_allmag2' : 'defmag',
      'icon_pot_base_200_allmag2_p1k' : 'defmag',
      'icon_pot_base_200_allmag3' : 'defmag',
      'icon_pot_base_200_bot1' : 'inst',
      'icon_pot_base_200_bot2' : 'dex',
      'icon_pot_base_200_bot3' : 'str',
      'icon_pot_base_200_bot4' : 'intel',
      'icon_pot_base_50_airproof' : 'defmag',
      'icon_pot_base_50_damageproof' : 'def',
      'icon_pot_base_50_dex' : 'dex',
      'icon_pot_base_50_dex2' : 'dex',
      'icon_pot_base_50_drobproof' : 'def',
      'icon_pot_base_50_earthproof' : 'defmag',
      'icon_pot_base_50_fireproof' : 'defmag',
      'icon_pot_base_50_gghpregen' : 'reg',
      'icon_pot_base_50_ggmanaregen' : 'regmana',
      'icon_pot_base_50_inst' : 'inst',
      'icon_pot_base_50_inst2' : 'inst',
      'icon_pot_base_50_intel' : 'intel',
      'icon_pot_base_50_intel2' : 'intel',
      'icon_pot_base_50_magicproof' : 'defmag',
      'icon_pot_base_50_mana_regen' : 'regmana',
      'icon_pot_base_50_regeneration' : 'reg',
      'icon_pot_base_50_str' : 'str',
      'icon_pot_base_50_str2' : 'str',
      'icon_pot_base_50_waterproof' : 'defmag'
    },
    setProperties: function(a, noSave) {
      this.active = a[0].value;
      this.dungeonOnly = a[1].value;
      this.autoDrinkHP = a[2].value;

      this.useSpawnElix = a[3].value;
      
      this.autoDrinkStat = a[4].value;
      this.autoDrinkDamage = a[5].value;
      this.autoDrinkMagic = a[6].value;
      this.autoDrinkRegen = a[7].value;
      this.autoDrinkRegenMana = a[8].value;
      this.autoDrinkLevel = parseFloat(a[9].value) || 95;
      var spellsRequired = a[10].value.split(/\s*[\n\r]+\s*/);
      this.spellsRequired = {};
      for(var i in spellsRequired) {
        var match = spellsRequired[i].match(/^(.*?)=(.*)$/);
        if (match)
          this.spellsRequired[match[1]]=match[2];
      }
      this.debugging = a[12].value;

      if (!noSave) {
        this.configurator.saveIni('autoDrinkHP',  this.autoDrinkHP.toString());
        this.configurator.saveIni('useSpawnElix',  this.useSpawnElix.toString());
        this.configurator.saveIni('autoDrinkStat',  this.autoDrinkStat.toString());
        this.configurator.saveIni('autoDrinkDamage', this.autoDrinkDamage.toString());
        this.configurator.saveIni('autoDrinkMagic', this.autoDrinkMagic.toString());
        this.configurator.saveIni('autoDrinkRegen', this.autoDrinkRegen.toString());
        this.configurator.saveIni('autoDrinkRegenMana', this.autoDrinkRegenMana.toString());

        this.configurator.saveIni('dungeonOnly',this.dungeonOnly.toString());
        this.configurator.saveIni('autoDrinkLevel',this.autoDrinkLevel.toString());
        this.configurator.saveIni('spellsRequired',spellsRequired.join(';'));
        this.configurator.saveIni('hotKey',this.hotKey);
        this.configurator.saveIni('debugging',this.debugging.toString());
      }

      this.checkActive();
    },
    setHotKey: function() {
      var hot_keys = combats_plugins_manager.plugins_list['hot_keys'];
      if (!hot_keys)
        return alert('К сожалению, не найден плагин hot_keys.\nНевозможно задать горячую клавишу.');
      hot_keys.showAssignDialog(
        this.hotKey,
        combats_plugins_manager.get_binded_method(
          this,
          function(result) {
            if (result) {
              if (this.hotKey)
                hot_keys.removeKeyHandler(this.hotKey);
              this.hotKey = result;
              hot_keys.setKeyHandler(this.hotKey,
                combats_plugins_manager.get_binded_method(this,this.checkHPviaAJAX),
                this.toString());
            }
          })
      );
    },
    checkActive: function() {
      if (this.active) {
        if (!this.loadHandler) {
          this.loadHandler = combats_plugins_manager.get_binded_method(this, this.mainframeLoad);
          this.checkEffectsHandler = combats_plugins_manager.get_binded_method(this, this.timerFunction);
        }
        combats_plugins_manager.attachEvent('mainframe.load',this.loadHandler);
        this.timerFunction();
      } else if (this.loadHandler) {
        combats_plugins_manager.detachEvent('mainframe.load',this.loadHandler);
        if (this.checkEffectsTimer) {
          clearTimeout(this.checkEffectsTimer);
          this.checkEffectsTimer = null;
        }
      }
    },

    dequeueRequest: function() {
      return this.requestsQueue.shift();
    },
    startRequest: function() {
      if (this.requestsQueue.length<=0) {
        this.isDrinkingElix = false;
        return;
      }
      if (this.startRequestTimer)
        clearTimeout(this.startRequestTimer);
      this.startRequestTimer = null;
      var drinkObj = { enable: true };
      combats_plugins_manager.fireEvent('drink_elix.before_drink', drinkObj);
      if (!drinkObj.enable) {
        top.Chat.am('Нельзя пить: это кому-то мешает');
        this.startRequestTimer = setTimeout(
          combats_plugins_manager.get_binded_method(this,this.startRequest),
          200);
        return;
      }

      var requestInfo = this.requestsQueue[0];
      requestInfo.AJAX = combats_plugins_manager.getHTTPRequestProcessor();
      requestInfo.AJAX.onComplete = combats_plugins_manager.get_binded_method(
        this,
        function(AJAX) {
          try {
            if (!requestInfo.onComplete(AJAX))
              this.dequeueRequest();
          } catch(e) {
            combats_plugins_manager.logError(this, e);
          }
          this.startRequest();
        });
      requestInfo.AJAX.onTimeout = combats_plugins_manager.get_binded_method(
        this,
        function() {
          try {
            this.addChat('Timeout');
            if (!requestInfo.onTimeout())
              this.dequeueRequest();
          } catch(e) {
            combats_plugins_manager.logError(this, e);
          }
          this.startRequest();
        });
      if (requestInfo.onBadStatus) {
        requestInfo.AJAX.onBadStatus = combats_plugins_manager.get_binded_method(
          this,
          function() {
            try {
              this.addChat('BadStatus');
              if (!requestInfo.onBadStatus())
                this.dequeueRequest();
            } catch(e) {
              combats_plugins_manager.logError(this, e);
            }
            this.startRequest();
          });
      } else
        requestInfo.AJAX.onBadStatus = requestInfo.AJAX.onTimeout;
      requestInfo.time = new Date();
      requestInfo.AJAX.startRequest(
        requestInfo.method,
        requestInfo.URL,
        requestInfo.data);
    },
    queueRequest: function(method, URL, data, onComplete, onTimeout, onBadStatus) {
      this.requestsQueue.push({
        method : method, 
        URL : URL, 
        data : data, 
        onComplete : onComplete, 
        onTimeout : onTimeout,
        onBadStatus : onBadStatus
      });
      if (this.requestsQueue.length==1) {
        this.isDrinkingElix = true;
        this.startRequest();
      }
    },

    addChat: function(s) {
      combats_plugins_manager.add_sys(s);
    },
    prolongEffect: function(effect) {
      if (this.isStat[effect] && !this.autoDrinkStat || 
          effect=='reg' && !this.autoDrinkRegen || 
          effect=='regmana' && !this.autoDrinkRegenMana || 
          effect=='def' && !this.autoDrinkDamage || 
          effect=='defmag' && !this.autoDrinkMagic)
      {
        return 0;
      }
      var nextIteration = 0;
      var result = this.startDrinkElix(this.elix[effect], 0);
      this.addChat('результат: '+result);
      switch (result) {
      case this.NO_ELIX: // у нас нет нужного элика, сваливаем
        break;
      case this.DRINK_UNKNOWN: // результат не распознан, нужно повторить через некоторое время
        nextIteration = 10;
        break;
      case this.DRINK_OK: // элик выпит
        break;
      }
      return nextIteration;
    },

    checkWaitList: function() {
      this.addChat('проверка ожидающих кастов');
      for(var spell in this.waitList) {
        this.addChat('есть ожидающие');
        return false;
      }
      this.addChat('нет ожидающих');
      return true;
    },

// === обработка выпивания элика ===
    drinkElixHandler: function(potions, attempt, AJAX) {
      var s = AJAX.responseText;
      match = s.match(/<FONT COLOR=red>(.*?)<\/FONT>/i);
      if (match && match[1] == '<B>Свиток не найден в вашем рюкзаке</B>') {
        this.addChat(match[1]);
        this.startDrinkElix(potions, attempt+1);
        return;
      } else if (match) {
        this.addChat(match[1]);
        return;
      }
      this.addChat('пили '+potions[attempt]+'. результат неизвестен');
    },
    drinkElixTimeoutHandler: function() {
      return true;
    },
    startDrinkElix: function(potions, attempt) {
      if (!potions[attempt]) {
        return this.NO_ELIX;
      }

      this.queueRequest(
        'GET',
        '/main.pl?use='+potions[attempt]+'&n=-1&'+Math.random(),
        '',
        combats_plugins_manager.get_binded_method(this,this.drinkElixHandler,potions,attempt),
        combats_plugins_manager.get_binded_method(this,this.drinkElixTimeoutHandler));
      return this.DRINK_UNKNOWN;
    },

// === обработка каста свитка ===
    castSpellHandler: function(spell,AJAX) {
      var s = AJAX.responseText;
      match = s.match(/<FONT COLOR=red>(.*?)<\/FONT>/i);
      if (!match 
          || match[1]=='<B>Недостаточно маны...</B>' 
          || match[1].indexOf('Способность не восстановилась')>=0)
      {
        this.addChat('добавили в список ожидающих: '+spell);
        if (!(spell in this.waitList))
          this.waitList[spell] = 1;
      } else if (match[1] == '<B>Свиток не найден в вашем рюкзаке</B>') {
        this.waitList[spell] = (spell in this.waitList)?this.waitList[spell]+1:1;
        if (this.waitList[spell]>1) {
          combats_plugins_manager.fireEvent('drink.no_spell', {spell:spell});
        }
      } else {
        this.addChat('убрали из списка ожидающих: '+spell);
        delete this.waitList[spell];
      }
      this.addChat('Использовали <b>'+((this.spellsRequired[spell])?this.spellsRequired[spell]:spell)+'</b>. Результат: '+(match?match[1]:'неизвестен'));
    },
    castSpellTimeoutHandler: function() {
      return true;
    },
    castSpell: function(spell) {
      this.queueRequest(
        'GET',
        '/main.pl?use='+spell+'&n=-1&'+Math.random(),
        '',
        combats_plugins_manager.get_binded_method(this,this.castSpellHandler,spell),
        combats_plugins_manager.get_binded_method(this,this.castSpellTimeoutHandler));
    },

// === обработка запроса эффектов ===
    getEffectsHandler: function(AJAX) {
      var nextIteration = 0;
      var isError = true;
      try {
        var s = AJAX.responseText;
        var images = s.match(/<IMG[^>]*?\/misc\/icons\/.*?\.gif[^>]*onmouseover=(["']).*?\1[^>]*>/gmi);
        
        this.effectsCheckRequired = false;
        if (images && images.length) {
          var spellsFound = {};
          this.addChat('Всего: '+images.length+' эффектов');
          for(var i=0; i<images.length; i++) {
            var match = images[i].match(/\/misc\/icons\/(.*?)\.gif[^>]*onmouseover='fastshow\("[^"]*<B>([^"<]*)<.*?Осталось\:\s*(?:\d+\s*нед\.\s*)?(?:\d+\s*дн\.\s*)?(?:(\d+)\s*ч\.\s*)?(?:(\d+)\s*мин\.\s*)?(?:(\d+)\s*сек\.)?.*?"[^>]*>/);
            if (match) {
              spellsFound[match[2]] = true;
              var time = (parseFloat(match[3]) || 0)*3600 + (parseFloat(match[4]) || 0)*60 + (parseFloat(match[5]) || 0);
              if (match[1].match(/^icon_pot_/)) { // пузырёк
                if (time<this.criticalTime) {
                  this.addChat(match[1]+': осталось '+time+' сек');
                  if (match[1] in this.effects) {
                    var effect = this.effects[match[1]];
                    nextIteration = this.prolongEffect(effect) || nextIteration;
                  }
                } else if (time<this.criticalTime+2*60 && (!nextIteration || nextIteration>time-(this.criticalTime+10))) {
                  nextIteration=time-(this.criticalTime+10);
                }
              } else if (match[1].match(/^ele_addict_/)) { // пристрастие
                if (match[1] in this.addicts) {
                  var effect = this.addicts[match[1]];
                  nextIteration = this.prolongEffect(effect) || nextIteration;
                }
              } else {
		for(var spell in this.spellsRequired) {
		  if (this.spellsRequired[spell]==match[2]) {
		    if (time<this.criticalTime) {
		      if (!(spell in this.waitList)) this.waitList[spell] = 1;
		      this.castSpell(spell);
		      nextIteration = 30; // если нужно что-то кастовать, то проверка через полминуты
		    }
		    break;
		  }
		}
              }
            }
          }
	  for(var spell in this.spellsRequired) {
	    if (!spellsFound[this.spellsRequired[spell]]) {
	      if (!(spell in this.waitList)) this.waitList[spell] = 1;
	      this.castSpell(spell);
	      nextIteration = 30; // если нужно что-то кастовать, то проверка через полминуты
	    }
	  }

          if (!nextIteration)
            nextIteration = 2*60; // следующий запрос через 2 минуты
        } else {
          this.addChat('Не вижу активных эффектов');
        }
        isError = false;
      } catch(e) {
        this.effectsCheckRequired = true;
        this.addChat('Сбой при анализе эффектов.');
      }
    },
    getEffectsTimeoutHandler: function() {
      this.effectsCheckRequired = true;
      this.addChat('Сбой загрузки страницы с эффектами. Перезапуск...');
      this.getEffects();
      return false;
    },
    getEffects: function() {
      this.queueRequest(
        'GET',
        '/main.pl?edit=3&'+Math.random(),
        '',
        combats_plugins_manager.get_binded_method(this,this.getEffectsHandler),
        combats_plugins_manager.get_binded_method(this,this.getEffectsTimeoutHandler));
      return true;
    },

    timerFunction: function() {
      if (this.checkEffectsTimer) {
        clearTimeout(this.checkEffectsTimer);
      }
      this.addChat('проверяем эффекты');
      var nextIteration = 0;
      var isError = true;
      try {
        if (top.Battle.bInBattle || this.requestsQueue.length)
          return;
        if (this.getEffects())
          nextIteration = 120;
      } finally {
        if (!nextIteration) {
          this.effectsCheckRequired = true;
          nextIteration = 10;
        }
        this.checkEffectsTimer = setTimeout(this.checkEffectsHandler, nextIteration*1000);
      }
/**/
    },
    checkHP: function(s) {
      var match = s.match(/top\.setHP\((.*?),(.*?),.*?\)/);
      if (match) {
        this.currentHP = parseFloat(match[1]);
        this.maxHP = parseFloat(match[2]);
        return true;
      }
      this.currentHP = 0;
      this.maxHP = 0;
      return false;
    },

// == Проверка выпивания эликов жизни ==
    drinkHPElixHandler: function(disableElix, AJAX) {
      this.isDrinkingHP = false;
      var s = AJAX.responseText;
      if (!s)
        return;
      match = s.match(/<FONT COLOR=red>(.*?)<\/FONT>/i);
      if (match && match[1] == '<B>Свиток не найден в вашем рюкзаке</B>') {
        this.drinkElix(disableElix);
      } else {
        this.drinkTime = new Date();
        if (match) {
          this.addChat(match[1]);
        }
        top.frames[3].location = '/main.pl?'+Math.random();
      }
    },
    drinkHPElixTimeoutHandler: function() {
      return true;
    },
    forceDrinkElix: function(disableElix) {
      disableElix = disableElix || {};

      var objName;
      if (this.useSpawnElix && this.maxHP-this.currentHP>500 && !disableElix['pot_cureHP250_20_gg'])
        objName = 'pot_cureHP250_20_gg';
      else if (this.maxHP-this.currentHP>500 && !disableElix['pot_cureHP250_20'])
        objName = 'pot_cureHP250_20';
      else if (!disableElix['pot_cureHP100_20'])
        objName = 'pot_cureHP100_20';
      if (!objName)
        return '';

      if (this.isDrinkingHP)
        return;
      this.isDrinkingHP = true;
      disableElix[objName] = true;
      
      this.queueRequest(
        'GET',
        '/main.pl?use='+objName+'&n=-1&'+Math.random(),
        '',
        combats_plugins_manager.get_binded_method(this,this.drinkHPElixHandler, disableElix),
        combats_plugins_manager.get_binded_method(this,this.drinkHPElixTimeoutHandler));
    },
    drinkElix: function(disableElix) {
      disableElix = disableElix || {};
      if (this.isDrinkingElix) {
        setTimeout(combats_plugins_manager.get_binded_method(this,this.drinkElix,disableElix), 500);
        return;
      }
      var time = (new Date().valueOf() - this.drinkTime.valueOf());
      if (time>2000) {
        if (this.currentHP/this.maxHP*100<this.autoDrinkLevel) {
          this.addChat('Надо выпить. Не хватает '+(this.maxHP-this.currentHP)+'HP. Прошло '+(time/1000)+' сек');
          this.forceDrinkElix(disableElix);
        }
      } else {
        this.addChat('Не пьём: прошло '+(time/1000)+' сек');
      }
    },
    checkHPviaAJAX: function() {
      this.AJAX.open('GET', '/main.pl?edit=5&filter=&'+Math.random(), false);
      this.AJAX.send('');
      if (this.checkHP(this.AJAX.responseText))
        this.drinkElix();
    },
    checkBlockDrink: function(eventObj) {
      if (!(top.frames[3].document.readyState=="complete" ||
            top.frames[3].document.readyState=="interactive" ||
            top.frames[3].document.readyState=="loaded")
          || this.blockingTimer)
      {
        if (this.debugging)
          this.addChat(top.frames[3].document.readyState+','+this.lastLoadTime)
        eventObj.enable = false;
      }
    },
    mainframeLoad: function() {
      this.lastLoadTime = (new Date()).toLocaleTimeString();
      if (this.blockingTimer)
        clearTimeout(this.blockingTimer);
      this.blockingTimer = setTimeout(
        combats_plugins_manager.get_binded_method(this,function(){this.blockingTimer = null;}),
        100);
      if (!this.autoDrinkHP)
        return;
      var inBattle = (top.frames[3].location.pathname.match(/^\/battle\d*\.pl/)!=null);
      
      try {
        if ((!this.dungeonOnly || top.frames[3].location.pathname.match(/^\/dungeon\d*\.pl/)) 
            && this.checkHP(top.frames[3].document.documentElement.innerHTML))
        {
          if (this.wasInBattle) {
            setTimeout(function(){top.frames[3].location = '/main.pl?'+Math.random();},10);
//            this.drinkTime = new Date(new Date().valueOf()-3000);
          } else {
            this.drinkElix();
          }
        }
      } finally {
        this.wasInBattle = inBattle;
      }
    },
    Init: function() {
      this.drinkTime = new Date();
      this.AJAX = combats_plugins_manager.getHTTPRequest();
      this.configurator = combats_plugins_manager.createConfigurationElement('drink_elix');
      this.hotKey = this.configurator.loadIni('hotKey', '');
      if (this.hotKey) {
        var hot_keys = combats_plugins_manager.plugins_list['hot_keys'];
        if (hot_keys)
          hot_keys.setKeyHandler(this.hotKey,
            combats_plugins_manager.get_binded_method(this,this.checkHPviaAJAX),
            this.toString());
//        else
//          throw new Error('Не загружен требующийся для работы плагин: <b>hot_keys</b>');
      }
      this.setProperties([
        { value: false },
        { value: this.configurator.loadIni('dungeonOnly','true')!='false' },

        { value: this.configurator.loadIni('autoDrinkHP','true')!='false' },
        { value: this.configurator.loadIni('useSpawnElix', 'false')=='true' },
        { value: this.configurator.loadIni('autoDrinkStat','true')!='false' },
        { value: this.configurator.loadIni('autoDrinkDamage','true')!='false' },
        { value: this.configurator.loadIni('autoDrinkMagic','true')!='false' },
        { value: this.configurator.loadIni('autoDrinkRegen','false')=='true' },
        { value: this.configurator.loadIni('autoDrinkRegenMana','false')=='true' },

        { value: this.configurator.loadIni('autoDrinkLevel','95') },
        { value: this.configurator.loadIni('spellsRequired','').split(';').join('\n') },
        { value: null },
        { value: this.configurator.loadIni('debugging','false')=='true' }
      ], true);

      top.combats_plugins_manager.plugins_list['top_tray'].addButton({
        'button': {
          'style': {
            'position': 'relative',
            'width': "28px",
            'height': "20px",
            'background': "#505050",
            'border': "2px outset",
            'overflow': "hidden"
            },
          'onclick': combats_plugins_manager.get_binded_method(this, this.checkHPviaAJAX)
          },
        'img': {
          'style': {
            'position': 'absolute',
            'left': '1px',
            'top': '-1px',
            'width': "25px",
            'height': "21px",
            'filter': "Glow(color=#DDDDDD,Strength=3,Enabled=0)"
            },
          'onmouseout': function() {
              this.filters.Glow.Enabled=0;
            },
          'onmouseover': function() {
              this.filters.Glow.Enabled=1;
            },
          'src': "file:///"+combats_plugins_manager.base_folder+"drink_elix/icon.gif",
          'alt': "Выпить эликсиры"
          }
        });

      combats_plugins_manager.attachEvent(
        'drink_elix.before_drink',
        combats_plugins_manager.get_binded_method(this, this.checkBlockDrink));
      return this;
    }
  }.Init();
})()