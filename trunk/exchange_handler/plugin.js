(function() {
  plugin_exchange_handler = function() {
    this.old_User_Exchange_Confirm = top.User.Exchange.Confirm;
    top.User.Exchange.Confirm = top.combats_plugins_manager.get_binded_method(
      this,this.new_User_Exchange_Confirm
    );
    this.old_User_Exchange_ConfirmDlg = top.User.Exchange.ConfirmDlg;
    top.User.Exchange.ConfirmDlg = top.combats_plugins_manager.get_binded_method(
      this,this.new_User_Exchange_ConfirmDlg
    );
    top.combats_plugins_manager.attachEvent('mainframe.load',
      top.combats_plugins_manager.get_binded_method(this,this.mainframeLoad));
    use( "User.Exchange.Transaction" );
    this.initTransactionLibrary();
  }

  plugin_exchange_handler.prototype = {
    toString: function() {
      return "Обработка передач";
    },
    new_User_Exchange_Confirm: function( sScript ){
      var eventObj = { sScript: sScript };
      top.combats_plugins_manager.fireEvent('exchange.confirm',eventObj)
      this.old_User_Exchange_Confirm.apply(top.User.Exchange,[ eventObj.sScript ]);
    },
    new_User_Exchange_ConfirmDlg: function( oRoot ){
      var eventObj = { oRoot: oRoot };
      top.combats_plugins_manager.fireEvent('exchange.confirmDlg',eventObj)
      this.old_User_Exchange_ConfirmDlg.apply(top.User.Exchange,[ eventObj.oRoot ]);
    },
    new_User_Exchange_Transaction_TransactionErrorLoad: function( oError ) {
	this.old_User_Exchange_Transaction_TransactionErrorLoad.apply(
		top.frames[0].Libraries['User.Exchange.Transaction'].oWindow.Self, [ oError ]
	);
	var eventObj = { error: Sender.Node( oError ) };
	  top.combats_plugins_manager.fireEvent('exchange.transactionError',eventObj);
    },
    new_User_Exchange_Transaction_TransactionLoad: function( oRoot ) {

	this.old_User_Exchange_Transaction_TransactionLoad.apply(
		top.frames[0].Libraries['User.Exchange.Transaction'].oWindow.Self, [ oRoot ]
	);

	for( var i = 0; i < oRoot.childNodes.length; i++ ) {
		var eventObj = { };
		switch( oRoot.childNodes[ i ].nodeName ) {
			case "action" :
				oAction = oRoot.childNodes[ i ];
				eventObj.action = Sender.Node( oAction ).action;
				switch( eventObj.action ) {
					case "tomybox":
						eventObj.items=[];
						for( var j = 0; j < oAction.childNodes.length; j++ ) {
							if( oAction.childNodes[ j ].nodeName == "item")
								eventObj.items.push(Sender.Node( oAction.childNodes[ j ] ).item);
						}
						break;

					case "toenemybox":
						eventObj.items=[];
						for( var j = 0; j < oAction.childNodes.length; j++ ) {
							if( oAction.childNodes[ j ].nodeName == "item")
								eventObj.items.push(Sender.Node( oAction.childNodes[ j ] ).item);
						}
						break;
					
					case "fromenemybox":
						eventObj.items=[];
						for( var j = 0; j < oAction.childNodes.length; j++ ) {
							if( oAction.childNodes[ j ].nodeName == "item" )
								eventObj.items.push(Sender.Node( oAction.childNodes[ j ] ).id);
						}
						break;

					case "frommybox":
						eventObj.items=[];
						for( var j = 0; j < oAction.childNodes.length; j++ ) {
							if( oAction.childNodes[ j ].nodeName == "item" ) {
								eventObj.items.push(Sender.Node( oAction.childNodes[ j ] ).item);
							}
						}
						break;
						
					case "setmycredit":
						break;
						
					case "setenemycredit":
						eventObj.credit=[];
						for( var j = 0; j < oAction.childNodes.length; j++ )
							if( oAction.childNodes[ j ].nodeName == "credit" )
								eventObj.credit.push(Sender.Node( oAction.childNodes[ j ] ).credit);
						break;
					
					case "cancel":
						break;
					
					case "myready":
						break;
						
						
					case "myaccept":
						break;
						
					case "enemyready":
						break;
					
					case "enemyaccept":
						break;
					
					case "noaccept":
						break;
					
				}
				break;
			
			case "message":
				eventObj.message = Sender.Node( oRoot.childNodes[ i ] );
				break;
			
			case "money":
				eventObj.money = Sender.Node( oRoot.childNodes[ i ] ).money;
				break;
		}
		
		top.combats_plugins_manager.fireEvent('exchange.transaction',eventObj)
	}
//      var eventObj = { oRoot: oRoot };
//      top.combats_plugins_manager.fireEvent('exchange.transaction',eventObj)
    },
    mainframeLoad: function() {
      var location = combats_plugins_manager.getMainFrame().location;
      if (location.pathname=='/exchange.pl' && /(?:^|&)status=completed?(?:&|$)/.test(location.search)) {
        top.combats_plugins_manager.fireEvent('exchange.completed',{});
      }
    },
    initTransactionLibrary: function() {
      if ('User.Exchange.Transaction' in top.frames[0].Libraries) {
        var oWindow = top.frames[0].Libraries['User.Exchange.Transaction'].oWindow;
        this.old_User_Exchange_Transaction_TransactionLoad = oWindow.TransactionLoad;
        oWindow.TransactionLoad = top.combats_plugins_manager.get_binded_method(
          this,this.new_User_Exchange_Transaction_TransactionLoad
        );
        this.old_User_Exchange_Transaction_TransactionErrorLoad = oWindow.TransactionErrorLoad;
        oWindow.TransactionErrorLoad = top.combats_plugins_manager.get_binded_method(
          this,this.new_User_Exchange_Transaction_TransactionErrorLoad
        );
      } else {
        setTimeout(
          top.combats_plugins_manager.get_binded_method(this,this.initTransactionLibrary),
          100
        );
      }
    }
  };

  return new plugin_exchange_handler();
})()