(function() {

  return {

	// configurable
	blockSize: 20, // lines
	blockInterval: 20, // msec

	blocks: [],

	log: function(s) {
		0 && combats_plugins_manager.add_sys(s);
	},

	toString: function() {
		return 'Устранение подтормаживания боя';
	},

    getProperties: function() {
      return [
        { name: "Максимальный размер блока строк", value: this.blockSize },
        { name: "Интервал добавления блоков строк (мс)", value: this.blockInterval }
      ];
    },
    setProperties: function(a) {
		this.blockSize = Math.max(1,parseFloat(a[0].value)||0);
		this.blockInterval = Math.max(0,parseFloat(a[1].value)||0);
		this.saveConfig();
    },
	saveConfig: function() {
        this.config.saveIni('blockSize', this.blockSize.toString());
        this.config.saveIni('blockInterval', this.blockInterval.toString());
	},
    
	WaitForBattleQueryInit: function(initialize) {
		this.log('WaitForBattleQueryInit');
		if (typeof(top.Battle.oBattle)!='object') {
			this.log('top.Battle.oBattle is not an object');
			initialize && initialize.apply(this,[]);
			return setTimeout(
				combats_plugins_manager.get_binded_method(this, this.WaitForBattleQueryInit),
				1000);
		}
		if (this.originalAddLogs)
			return;
		this.log('replace the top.Battle.oBattle.AddLogs');
		this.originalAddLogs = top.Battle.oBattle.AddLogs;
		top.Battle.oBattle.AddLogs = combats_plugins_manager.get_binded_method(
			this,
			this.AddLogs);
	},

	AddBlock: function(){
		var i = this.blockSize,
			block = [];
		while(this.blocks && this.blocks.length && i>0) {
			if (!this.blocks[0].length) {
				this.blocks.shift();
			} else {
				block.push(this.blocks[0].shift());
				i--;
			}
		}
		if (block.length) {
			setTimeout(
				combats_plugins_manager.get_binded_method(this,this.AddBlock),
				this.blockInterval);
			this.originalAddLogs.apply(top.Battle.oBattle, [block]);
		}
	},
				
	AddLogs: function( arrLogs ) {
	  try{
		if (arrLogs && arrLogs.length) {
			this.log('Battle: '+arrLogs.length+' new line(s)');
			var blocksAvailable = this.blocks.length>0;
			this.blocks.push(arrLogs);
			!blocksAvailable && this.AddBlock();
		} else {
			this.originalAddLogs.apply(top.Battle.oBattle, [arrLogs]);
		}
	  }catch(e){}
	},

	Init: function() {
		this.config = combats_plugins_manager.createConfigurationElement('battle_slowness_fix');
		this.blockSize = Math.max(1,parseFloat(this.config.loadIni('blockSize', '20'))||20);
		this.blockInterval = Math.max(0,parseFloat(this.config.loadIni('blockInterval', '20'))||20);

		this.WaitForBattleQueryInit(function(){
			this.log('replace the top.Battle.Init');
			this.originalBattleInit = top.Battle.Init;
			top.Battle.Init = combats_plugins_manager.get_binded_method(this, function( sScript ) {
				this.log('original Battle.Init: '+sScript);
				this.originalBattleInit.apply( top.Battle, [sScript] );
				this.WaitForBattleQueryInit();
			});
		});

		return this;
	}
  }.Init();

})()