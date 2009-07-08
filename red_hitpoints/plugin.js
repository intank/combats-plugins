(function (){
  return {
    active: false,
    faultCounter: 0,

    toString: function() {
      return "Поддержание HP в красной зоне";
    },

    getProperties: function() {
      return [
        {name:"Активен", value:this.active},
        {name:"Запас HP", value:this.reserve},
        {name:"Отменять передачу", value:this.cancelExchange},
        {name:"Использовать принудительное надевание для поддержания уровня", value:this.forceDress},
        {name:"Период принудительного надевания (с)", value:this.forceDressPeriod},
        {name:"Идентификатор комплекта с максимумом HP", value:this.complect},
        {name:'Блокировать перемещение со снятым комплектом', value:this.disableRunNude}
      ];
    },
    setProperties: function(a) {
      var wasActive = this.active;
      this.active = a[0].value;
      this.reserve = parseFloat(a[1].value) || 0;
      this.cancelExchange = a[2].value;
      this.forceDress = a[3].value;
      this.forceDressPeriod = Math.max(2,parseFloat(a[4].value) || 0);
      this.complect = a[5].value.replace(/^.*?skmp=(\d+).*?$/,'$1');
      this.disableRunNude = a[6].value;

      this.configurator.saveIni('reserve', this.reserve.toString());
      this.configurator.saveIni('cancelExchange', this.cancelExchange.toString());
      this.configurator.saveIni('forceDress', this.forceDress.toString());
      this.configurator.saveIni('forceDressPeriod', this.forceDressPeriod.toString());
      this.configurator.saveIni('complect', this.complect);
      this.configurator.saveIni('disableRunNude', this.disableRunNude.toString());

      if (wasActive && !this.active)
        this.deactivate();
      if (!wasActive && this.active) {
        this.activate();
      }
    },

    locationStep: function(eventObj) {
      eventObj.enable &= (!this.disableRunNude || !this.disableRun);
    },

    restartCheckTimer: function() {
      if (this.active)
        this.timer = setTimeout(
          combats_plugins_manager.get_binded_method(this,this.checkHP),
          1000);
      else
        this.timer = null;
    },
    dress_complete: function(force,AJAX) {
      this.disableRun = false;
      if (this.forceDress && this.active) {
        this.forceDressTimer = setTimeout(
          combats_plugins_manager.get_binded_method(this,this.startDress,true),
          this.forceDressPeriod*1000);
      }
      if (!force)
        this.restartCheckTimer();
    },
    dress_fault: function(force,AJAX) {
      this.faultCounter++;
      if (force)
        this.startDress(true);
      else
        this.restartCheckTimer();
    },
    startDress: function(force) {
      if (this.forceDressTimer)
        clearTimeout(this.forceDressTimer);
      this.AJAX = combats_plugins_manager.getHTTPRequestProcessor();
      this.AJAX.onComplete =
        combats_plugins_manager.get_binded_method(this,this.dress_complete,force);
      this.AJAX.onTimeout = this.AJAX.onBadStatus =
        combats_plugins_manager.get_binded_method(this,this.dress_fault,force);
      this.AJAX.GET('/main.pl?skmp='+this.complect+'&'+Math.random());
    },

    cancelExchange_complete: function(AJAX) {
      this.startStriptease();
    },
    cancelExchange_fault: function(AJAX) {
      this.faultCounter++;
      this.restartCheckTimer();
    },
    startCancelExchange: function() {
      this.AJAX = combats_plugins_manager.getHTTPRequestProcessor();
      this.AJAX.onComplete =
        combats_plugins_manager.get_binded_method(this,this.cancelExchange_complete);
      this.AJAX.onTimeout = this.AJAX.onBadStatus =
        combats_plugins_manager.get_binded_method(this,this.cancelExchange_fault);
      this.AJAX.GET('/exchange.pl?setcancel=1&tmp='+Math.random());
    },

    striptease_complete: function(AJAX) {
      if (this.cancelExchange
          && /\Wuse\s*\(\s*"User\.Exchange(?:\.Transaction|)"\s*\)/.test(AJAX.responseText))
      {
        this.startCancelExchange();
      } else {
        this.startDress(false);
      }
    },
    striptease_fault: function(AJAX) {
      this.faultCounter++;
      this.restartCheckTimer();
    },
    startStriptease: function() {
      this.disableRun = true;
      if (this.forceDressTimer)
        clearTimeout(this.forceDressTimer);
      this.AJAX = combats_plugins_manager.getHTTPRequestProcessor();
      this.AJAX.onComplete =
        combats_plugins_manager.get_binded_method(this,this.striptease_complete);
      this.AJAX.onTimeout = this.AJAX.onBadStatus =
        combats_plugins_manager.get_binded_method(this,this.striptease_fault);
      this.AJAX.GET('/main.pl?setdown=all&sd4='+top.sd4+'&'+Math.random());
    },

    checkHP_complete: function(AJAX) {
      var s = AJAX.responseText;
      var match = s.match(/top\.setHP\(([\d\.]+),([\d\.]+),[\d\.]+\)/);
      if (match) {
        this.faultCounter = 0;
        if ((parseFloat(match[1])+this.reserve)*3 > match[2]) { // надо раздеться
          this.startStriptease();
          return;
        }
      } else {
        this.faultCounter++;
      }
      this.restartCheckTimer();
    },
    checkHP_fault: function(AJAX) {
      try {
        var s = AJAX.responseText;
      } catch(e) {
      }
      this.faultCounter++;
      this.restartCheckTimer();
    },
    checkHP: function() {
      if (!this.active)
        return;
      this.AJAX = combats_plugins_manager.getHTTPRequestProcessor();
      this.AJAX.onComplete =
        combats_plugins_manager.get_binded_method(this,this.checkHP_complete);
      this.AJAX.onTimeout = this.AJAX.onBadStatus =
        combats_plugins_manager.get_binded_method(this,this.checkHP_fault);
      this.AJAX.GET('/zayavka.pl?level=fiz&'+Math.random());
    },

    activate: function(setActive) {
      if (setActive)
        this.active = true;
      if (!this.complect) {
        this.active = false;
        combats_plugins_manager.add_chat('<b>Ошибка:</b> Невозможно активировать плагин, не задавая комплект')
        return;
      }
      if (this.timer)
        clearTimeout(this.timer);
      this.restartCheckTimer();
    },
    deactivate: function(resetActive) {
      if (resetActive)
        this.active = false;
    },

    Init: function() {
      this.configurator = combats_plugins_manager.createConfigurationElement('red_hitpoints');
      this.complect = this.configurator.loadIni('complect', '');
      this.reserve = parseFloat(this.configurator.loadIni('reserve', '10')) || 0;
      this.cancelExchange = this.configurator.loadIni('cancelExchange', 'true') != 'false';
      this.forceDress = this.configurator.loadIni('forceDress', 'true') == 'true';
      this.forceDressPeriod = parseFloat(this.configurator.loadIni('forceDressPeriod', '10')) || 0;
      this.disableRunNude = this.configurator.loadIni('disableRunNude', 'false') == 'true';

      combats_plugins_manager.attachEvent('location_step',
        combats_plugins_manager.get_binded_method(this, this.locationStep));

      return this;
    }
  }.Init();
})()